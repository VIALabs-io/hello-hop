import { deployments, ethers, network } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { MessageTest, MessageV3, MockToken, MockWETH } from "../typechain-types";

describe("MessageV3", function () {
	async function deployMessageV3Fixture() {
		const [deployer, wallet, destination, accountant, exsigSigner, chainsigSigner] = await ethers.getSigners();

		// @note This will auto-deploy if needed, feature from hardhat-deploy
		await deployments.fixture();

		const bridge = (await ethers.getContract("MessageV3")) as MessageV3;
		const feeToken = (await ethers.getContract("MockToken")) as MockToken;
		const weth = (await ethers.getContract("MockWETH")) as MockWETH;
		const test = (await ethers.getContract("MessageTest")) as MessageTest;

		await (await feeToken.connect(deployer).mint(wallet.address, ethers.parseUnits("10000", 18))).wait();

		await (
			await deployer.sendTransaction({
				to: test.target,
				value: ethers.parseUnits("20", 18),
			})
		).wait();

		// function setBridgeStatus(bool _status) external onlySuper
		// function init(address _weth, address _feeToken, address _accountant) external onlyOwner initOnce
		await (await bridge.connect(deployer).init(weth.target, feeToken.target, accountant.address)).wait();
		await (await bridge.connect(deployer).setSuper(deployer.address, true)).wait();
		await (await bridge.connect(deployer).setATeam(deployer.address, true)).wait();
		await (await bridge.connect(deployer).setBridgeStatus(true)).wait();
		// function setChainStatus(uint[] calldata _chain, bool[] calldata _status, uint[] calldata _expressFee)
		await (await bridge.connect(deployer).setChainStatus([250, 31337], [true, true], [50, 50])).wait();
		await (await bridge.connect(deployer).setOperator(wallet.address, true)).wait();

		await (await weth.connect(deployer).deposit({ value: ethers.parseUnits("100", 18) })).wait();

		const coder = ethers.AbiCoder.defaultAbiCoder();
		// const encodedData = coder.encode(["address", "uint256", "string"], [destination.address, ethers.parseUnits("1234", 18), "custom-data-sent"]);
		const encodedData = coder.encode(["bool", "string"], [false, "custom-data-sent"]);

		return {
			deployer,
			wallet,
			destination,
			accountant,
			bridge,
			feeToken,
			weth,
			test,
			encodedData,
			exsigSigner,
			chainsigSigner,
		};
	}

	describe("sendMessage()", function () {
		it("Accepts message without taking fees when takeFeesOffline is true", async function () {
			const { deployer, wallet, destination, accountant, bridge, encodedData } = await loadFixture(deployMessageV3Fixture);

			await (await bridge.connect(deployer).setTakeFeesOffline(true)).wait();

			// @note Use the bridge directly isntead of MessageTest so we have more flexiblity as far as parameters. For example when testing express fees.
			await expect(bridge.connect(wallet).sendMessage(destination.address, 31337, encodedData, 3, false))
				.to.emit(bridge, "SendRequested")
				.withArgs(
					// NEXT_TX_ID = (_chainId * 1e23);
					// nextTxId = _chain * 10**8;
					ethers.parseUnits("3133700000000000000000000001", 0),
					wallet.address,
					destination.address,
					31337,
					false,
					encodedData,
					3
				);
		});

		it("Accepts message taking proper standard fees", async function () {
			const { deployer, wallet, destination, accountant, bridge, feeToken, encodedData } = await loadFixture(deployMessageV3Fixture);

			await (await feeToken.connect(wallet).approve(bridge.target, ethers.MaxInt256)).wait();
			await (await bridge.connect(wallet).sendMessage(destination.address, 31337, encodedData, 3, false)).wait();

			const balance = await feeToken.connect(accountant).balanceOf(accountant.address);
			expect(balance).to.equal(ethers.parseUnits("0.25", 18));
		});

		it("Accepts a message by taking custom fees for a project", async function () {
			const { deployer, wallet, destination, accountant, bridge, feeToken, encodedData } = await loadFixture(deployMessageV3Fixture);

			await (await bridge.connect(deployer).setCustomSourceFee(wallet.address, 1300000)).wait();
			await (await feeToken.connect(wallet).approve(bridge.target, ethers.MaxInt256)).wait();
			await (await bridge.connect(wallet).sendMessage(destination.address, 31337, encodedData, 3, false)).wait();

			const balance = await feeToken.connect(accountant).balanceOf(accountant.address);
			expect(balance).to.equal(ethers.parseUnits("1.30", 18));
		});

		it("Accepts a zero zero fee (9999) for a project", async function () {
			const { deployer, wallet, destination, accountant, bridge, feeToken, encodedData } = await loadFixture(deployMessageV3Fixture);

			await (await bridge.connect(deployer).setCustomSourceFee(wallet.address, 9999)).wait();
			await (await feeToken.connect(wallet).approve(bridge.target, ethers.MaxInt256)).wait();
			await (await bridge.connect(wallet).sendMessage(destination.address, 31337, encodedData, 3, false)).wait();

			const balance = await feeToken.connect(accountant).balanceOf(accountant.address);
			expect(balance).to.equal(0);
		});

		it("Rejects a message if not able to take standard fees", async function () {
			const { deployer, wallet, destination, accountant, bridge, feeToken, encodedData } = await loadFixture(deployMessageV3Fixture);

			// @note remove money
			await (await feeToken.connect(wallet).transfer(deployer.address, ethers.parseUnits("10000", 18))).wait();

			await (await feeToken.connect(wallet).approve(bridge.target, ethers.MaxInt256)).wait();

			await expect(bridge.connect(wallet).sendMessage(destination.address, 31337, encodedData, 3, false)).to.be.revertedWith(
				"ERC20: transfer amount exceeds balance"
			);
		});

		it("Rejects a message if not able to take custom fees", async function () {
			const { deployer, wallet, destination, accountant, bridge, feeToken, encodedData } = await loadFixture(deployMessageV3Fixture);

			// @note remove money
			await (await feeToken.connect(wallet).transfer(deployer.address, ethers.parseUnits("10000", 18))).wait();

			await (await bridge.connect(deployer).setCustomSourceFee(wallet.address, 130)).wait();
			await (await feeToken.connect(wallet).approve(bridge.target, ethers.MaxInt256)).wait();

			await expect(bridge.connect(wallet).sendMessage(destination.address, 31337, encodedData, 3, false)).to.be.revertedWith(
				"ERC20: transfer amount exceeds balance"
			);
		});
	});

	describe("process()", function () {
		it("Sends message to destination contract when gas = 0 and destination contract has no weth", async function () {
			const { deployer, wallet, destination, accountant, bridge, feeToken, weth, encodedData, test } = await loadFixture(
				deployMessageV3Fixture
			);

			const coder = ethers.AbiCoder.defaultAbiCoder();
			const customData = coder.encode(["bool", "string"], [false, "custom-data-sent"]);

			await (await test.connect(deployer).configure(bridge.target, [250, 31337], [wallet.address, wallet.address])).wait();

			await expect(
				bridge
					.connect(wallet)
					.process(ethers.parseUnits("3133700000000000000000000001", 0), 250, 31337, wallet.address, test.target, 0, [
						customData,
						customData,
						customData,
					])
			)
				// .to.emit(bridge, "ErrorLog")
				// .withArgs(ethers.parseUnits("3133700000000000000000000001", 0), "MessageV3: uncallable: fatal")
				// .withArgs(ethers.parseUnits("3133700000000000000000000001", 0), "MessageV3: recipient: MessageTest: forced revert")
				// .withArgs(ethers.parseUnits("3133700000000000000000000001", 0), "MessageV3: recipient: general fail")
				.to.emit(bridge, "Success")
				.withArgs(ethers.parseUnits("3133700000000000000000000001", 0), 250, wallet.address, test.target, 0)
				.to.emit(bridge, "SendProcessed")
				.withArgs(ethers.parseUnits("3133700000000000000000000001", 0), 250, wallet.address, test.target);
		});

		it("Sends message to destination contracts when gas > 0 and sends gas to tx.origin", async function () {
			const { deployer, wallet, destination, accountant, bridge, feeToken, weth, encodedData, test } = await loadFixture(
				deployMessageV3Fixture
			);

			const coder = ethers.AbiCoder.defaultAbiCoder();
			const customData = coder.encode(["bool", "string"], [false, "custom-data-sent"]);

			await (await test.connect(deployer).configure(bridge.target, [250, 31337], [wallet.address, wallet.address])).wait();
			// @note Send gas source as WETH
			await (await weth.connect(deployer).transfer(test.target, ethers.parseUnits("20", 18))).wait();

			await network.provider.request({
				method: "hardhat_impersonateAccount",
				params: [test.target],
			});

			const impersonatedContract = await ethers.getSigner(String(test.target));

			await (await weth.connect(impersonatedContract).approve(bridge.target, ethers.MaxInt256)).wait();

			await network.provider.request({
				method: "hardhat_stopImpersonatingAccount",
				params: [test.target],
			});

			const walletBalancePre = await ethers.provider.getBalance(wallet.address);
			await expect(
				bridge
					.connect(wallet)
					.process(
						ethers.parseUnits("3133700000000000000000000001", 0),
						250,
						31337,
						wallet.address,
						test.target,
						ethers.parseUnits("3", 18),
						[customData, customData, customData]
					)
			)
				.to.emit(bridge, "Success")
				.withArgs(ethers.parseUnits("3133700000000000000000000001", 0), 250, wallet.address, test.target, 0)
				.to.emit(bridge, "SendProcessed")
				.withArgs(ethers.parseUnits("3133700000000000000000000001", 0), 250, wallet.address, test.target);

			const contractBalance = await weth.connect(wallet).balanceOf(test.target);
			// console.log("Weth balance of acc");
			// console.log(await weth.connect(deployer).balanceOf(accountant.address));
			const walletBalancePost = await ethers.provider.getBalance(wallet.address);

			// await (await bridge.connect(deployer).recover(weth.target, ethers.parseUnits("3", 18))).wait();
			// console.log(await weth.connect(deployer).balanceOf(accountant.address));

			expect(contractBalance).to.equal(ethers.parseUnits("17", 18));
			expect(parseFloat(ethers.formatUnits(walletBalancePost, 18))).to.be.above(parseFloat(ethers.formatUnits(walletBalancePre, 18)));
		});

		it("Marks transaction complete if the destination contract reverts without itself reverting", async function () {
			const { deployer, wallet, destination, accountant, bridge, feeToken, weth, encodedData, test } = await loadFixture(
				deployMessageV3Fixture
			);

			const coder = ethers.AbiCoder.defaultAbiCoder();
			// @note Make it revert on purpose
			const customData = coder.encode(["bool", "string"], [true, "custom-data-sent"]);

			await (await test.connect(deployer).configure(bridge.target, [250, 31337], [wallet.address, wallet.address])).wait();

			await expect(
				bridge
					.connect(wallet)
					.process(ethers.parseUnits("3133700000000000000000000001", 0), 250, 31337, wallet.address, test.target, 0, [
						customData,
						customData,
						customData,
					])
			)
				.to.emit(bridge, "ErrorLog")
				.withArgs(ethers.parseUnits("3133700000000000000000000001", 0), "MessageV3: recipient: MessageTest: forced revert")
				.to.emit(bridge, "SendProcessed")
				.withArgs(ethers.parseUnits("3133700000000000000000000001", 0), 250, wallet.address, test.target);
		});

		it("Marks transaction complete if the destination contract does not have valid messageProcess", async function () {
			const { deployer, wallet, destination, accountant, bridge, feeToken, weth, encodedData, test } = await loadFixture(
				deployMessageV3Fixture
			);

			const coder = ethers.AbiCoder.defaultAbiCoder();
			const customData = coder.encode(["bool", "string"], [false, "custom-data-sent"]);

			await (await test.connect(deployer).configure(bridge.target, [250, 31337], [wallet.address, wallet.address])).wait();

			await expect(
				bridge
					.connect(wallet)
					// @dev send to an EOA (which by rule is not a contract and does not have messageProcess functionality)
					.process(ethers.parseUnits("3133700000000000000000000001", 0), 250, 31337, wallet.address, bridge.target, 0, [
						customData,
						customData,
						customData,
					])
			)
				.to.emit(bridge, "ErrorLog")
				.withArgs(ethers.parseUnits("3133700000000000000000000001", 0), "MessageV3: recipient: fatal failure")
				.to.emit(bridge, "SendProcessed")
				.withArgs(ethers.parseUnits("3133700000000000000000000001", 0), 250, wallet.address, bridge.target);
		});

		it("Marks transaction complete if the destination is an EOA", async function () {
			const { deployer, wallet, destination, accountant, bridge, feeToken, weth, encodedData, test } = await loadFixture(
				deployMessageV3Fixture
			);

			const coder = ethers.AbiCoder.defaultAbiCoder();
			const customData = coder.encode(["bool", "string"], [false, "custom-data-sent"]);

			await (await test.connect(deployer).configure(bridge.target, [250, 31337], [wallet.address, wallet.address])).wait();

			await expect(
				bridge
					.connect(wallet)
					// @dev send to wrong target address that does not have messageProcess functionality
					.process(ethers.parseUnits("3133700000000000000000000001", 0), 250, 31337, wallet.address, wallet.address, 0, [
						customData,
						customData,
						customData,
					])
			)
				.to.emit(bridge, "ErrorLog")
				.withArgs(ethers.parseUnits("3133700000000000000000000001", 0), "MessageV3: uncallable: fatal failure")
				.to.emit(bridge, "SendProcessed")
				.withArgs(ethers.parseUnits("3133700000000000000000000001", 0), 250, wallet.address, wallet.address);
		});

		it("Marks transaction complete if the destination contract has a fatal error without itself reverting", async function () {
			const { deployer, wallet, destination, accountant, bridge, feeToken, weth, encodedData, test } = await loadFixture(
				deployMessageV3Fixture
			);

			const coder = ethers.AbiCoder.defaultAbiCoder();
			// @note Make it have a corrupted abi so it fatally errors
			const customData = coder.encode(["bool"], [false]);

			await (await test.connect(deployer).configure(bridge.target, [250, 31337], [wallet.address, wallet.address])).wait();

			await expect(
				bridge
					.connect(wallet)
					.process(ethers.parseUnits("3133700000000000000000000001", 0), 250, 31337, wallet.address, test.target, 0, [
						customData,
						customData,
						customData,
					])
			)
				.to.emit(bridge, "ErrorLog")
				.withArgs(ethers.parseUnits("3133700000000000000000000001", 0), "MessageV3: recipient: fatal failure")
				.to.emit(bridge, "SendProcessed")
				.withArgs(ethers.parseUnits("3133700000000000000000000001", 0), 250, wallet.address, test.target);
		});
	});

	describe("process() with project external signature", async function () {
		it("Passes with a valid and required exsig signature", async function () {
			const { deployer, wallet, destination, accountant, bridge, feeToken, weth, encodedData, test, exsigSigner, chainsigSigner } =
				await loadFixture(deployMessageV3Fixture);

			const coder = ethers.AbiCoder.defaultAbiCoder();
			const customData = coder.encode(["bool", "string"], [false, "custom-data-sent"]);
			await (await test.connect(deployer).configure(bridge.target, [250, 31337], [wallet.address, wallet.address])).wait();

			await await test.connect(deployer).setExsig(exsigSigner.address);
			const exsigMessageToSign = ethers.AbiCoder.defaultAbiCoder().encode(
				["uint256", "uint256", "uint256", "address", "address", "bytes"],
				[
					ethers.parseUnits("3133700000000000000000000001", 0), // txId
					250, // sourceChainId
					31337, // destChainId
					wallet.address, // sender
					test.target, // recipient
					customData, // message package
				]
			);
			const exsigSignature = await exsigSigner.signMessage(ethers.getBytes(ethers.keccak256(exsigMessageToSign)));

			await expect(
				bridge
					.connect(wallet)
					.process(ethers.parseUnits("3133700000000000000000000001", 0), 250, 31337, wallet.address, test.target, 0, [
						customData,
						exsigSignature,
						customData,
					])
			)
				.to.emit(bridge, "Success")
				.withArgs(ethers.parseUnits("3133700000000000000000000001", 0), 250, wallet.address, test.target, 0)
				.to.emit(bridge, "SendProcessed")
				.withArgs(ethers.parseUnits("3133700000000000000000000001", 0), 250, wallet.address, test.target);
		});

		it("Reverts if the exsig is required and not valid", async function () {
			const { deployer, wallet, destination, accountant, bridge, feeToken, weth, encodedData, test, exsigSigner, chainsigSigner } =
				await loadFixture(deployMessageV3Fixture);

			const coder = ethers.AbiCoder.defaultAbiCoder();
			const customData = coder.encode(["bool", "string"], [true, "custom-data-sent"]);
			await (await test.connect(deployer).configure(bridge.target, [250, 31337], [wallet.address, wallet.address])).wait();

			await await test.connect(deployer).setExsig(exsigSigner.address);
			const exsigMessageToSign = ethers.AbiCoder.defaultAbiCoder().encode(
				["uint256", "uint256", "uint256", "address", "address", "bytes"],
				[
					ethers.parseUnits("3133700000000000000000000001", 0), // txId
					250, // sourceChainId
					31337, // destChainId
					wallet.address, // sender
					test.target, // recipient
					customData, // message package
				]
			);
			// @note sign with deployer, which is not valid exsig signer
			const exsigSignature = await deployer.signMessage(ethers.getBytes(ethers.keccak256(exsigMessageToSign)));

			await expect(
				bridge
					.connect(wallet)
					.process(ethers.parseUnits("3133700000000000000000000001", 0), 250, 31337, wallet.address, test.target, 0, [
						customData,
						exsigSignature,
						customData,
					])
			).to.be.revertedWith("MessageV3: invalid external project signature");
		});
	});

	describe("process() with chain external signature", async function () {
		it("Passes with a valid and required chainsig signature", async function () {
			const { deployer, wallet, destination, accountant, bridge, feeToken, weth, encodedData, test, exsigSigner, chainsigSigner } =
				await loadFixture(deployMessageV3Fixture);

			const coder = ethers.AbiCoder.defaultAbiCoder();
			const customData = coder.encode(["bool", "string"], [false, "custom-data-sent"]);
			await (await test.connect(deployer).configure(bridge.target, [250, 31337], [wallet.address, wallet.address])).wait();

			await await bridge.connect(deployer).setChainsig(chainsigSigner.address);
			const exsigMessageToSign = ethers.AbiCoder.defaultAbiCoder().encode(
				["uint256", "uint256", "uint256", "address", "address", "bytes"],
				[
					ethers.parseUnits("3133700000000000000000000001", 0), // txId
					250, // sourceChainId
					31337, // destChainId
					wallet.address, // sender
					test.target, // recipient
					customData, // message package
				]
			);
			const chainsigSignature = await chainsigSigner.signMessage(ethers.getBytes(ethers.keccak256(exsigMessageToSign)));

			await expect(
				bridge
					.connect(wallet)
					.process(ethers.parseUnits("3133700000000000000000000001", 0), 250, 31337, wallet.address, test.target, 0, [
						customData,
						customData,
						chainsigSignature,
					])
			)
				.to.emit(bridge, "Success")
				.withArgs(ethers.parseUnits("3133700000000000000000000001", 0), 250, wallet.address, test.target, 0)
				.to.emit(bridge, "SendProcessed")
				.withArgs(ethers.parseUnits("3133700000000000000000000001", 0), 250, wallet.address, test.target);
		});

		it("Reverts if the chainsig is required and not valid", async function () {
			const { deployer, wallet, destination, accountant, bridge, feeToken, weth, encodedData, test, exsigSigner, chainsigSigner } =
				await loadFixture(deployMessageV3Fixture);

			const coder = ethers.AbiCoder.defaultAbiCoder();
			const customData = coder.encode(["bool", "string"], [true, "custom-data-sent"]);
			await (await test.connect(deployer).configure(bridge.target, [250, 31337], [wallet.address, wallet.address])).wait();

			await await bridge.connect(deployer).setChainsig(chainsigSigner.address);
			const exsigMessageToSign = ethers.AbiCoder.defaultAbiCoder().encode(
				["uint256", "uint256", "uint256", "address", "address", "bytes"],
				[
					ethers.parseUnits("3133700000000000000000000001", 0), // txId
					250, // sourceChainId
					31337, // destChainId
					wallet.address, // sender
					test.target, // recipient
					customData, // message package
				]
			);
			// @dev we use deployer to sign since it is not a valid chainsig signer
			const chainsigSignature = await deployer.signMessage(ethers.getBytes(ethers.keccak256(exsigMessageToSign)));

			await expect(
				bridge
					.connect(wallet)
					.process(ethers.parseUnits("3133700000000000000000000001", 0), 250, 31337, wallet.address, test.target, 0, [
						customData,
						customData,
						chainsigSignature,
					])
			).to.be.revertedWith("MessageV3: invalid external chain signature");
		});
	});
});
