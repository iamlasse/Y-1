const Y = artifacts.require("Y");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const assert = chai.assert;

contract("Y", accounts => {
  const payer = accounts[1];
  const payee = accounts[2];
  const donee = accounts[3];

  beforeEach(async function() {
    y = await Y.new(25, 100, { from: payee });
  });

  it("throws if you try to deploy with a donation proportion of 0%", () => {
    assert.isRejected(Y.new(0, 100));
  });

  it("throws if you try to deploy with a donation proportion of >= 100%", () => {
    assert.isRejected(Y.new(100, 100));
  });

  it("lets you read the donation proportion", async () => {
    const [num, denom] = await y.donationProportion();
    assert.isTrue(num.equals(25) && denom.equals(100));
  });

  it("lets the payee set the donation proportion", async () => {
    const result = await y.setDonationProportion(10, 100, { from: payee }); // TODO different proportion to what's already on the contract
    const [num, denom] = await y.donationProportion();
    assert.isTrue(num.equals(10) && denom.equals(100));
  });

  it("throws if you try to set a donation proportion of 0%", () => {
    assert.isRejected(y.setDonationProportion(0, 100, { from: payee }));
  });

  it("throws if you try to set a donation proportion of >= 100%", () => {
    assert.isRejected(y.setDonationProportion(100, 100, { from: payee }));
  });

  it("throws if someone other than the payee tries to set the donation proportion", () => {
    assert.isRejected(y.setDonationProportion(1, 100, { from: payer }));
  });

  // it("should change the balances as expected", async () => {
  //   const oneEther = web3.toWei(1, "ether");
  //   const donation = web3.toWei(0.25, "ether");
  //
  //   // payer: balance -> balance - value,
  //   // payee: balance -> balance + value - donation,
  //   // donee: balance -> balance + donation
  //
  //   // get each of the balances before the tx
  //   const balances = async () => {
  //     return {
  //       payer: await web3.eth.getBalance(payer),
  //       payee: await web3.eth.getBalance(payee),
  //       donee: await web3.eth.getBalance(donee)
  //     };
  //   };
  //
  //   const before = await balances();
  //
  //   // do the tx
  //   await y.payAndDonate(payee, donee, {
  //     from: payer,
  //     value: oneEther
  //   });
  //   // get each of the balances after the tx
  //   const after = await balances();
  //
  //   // console.log((await web3.eth.getBalance(y.address)).toNumber() / 10 ** 18);
  //   // console.log((await web3.eth.getBalance(payer)).toNumber() / 10 ** 18);
  //   // console.log((await web3.eth.getBalance(payee)).toNumber() / 10 ** 18);
  //   // console.log((await web3.eth.getBalance(donee)).toNumber() / 10 ** 18);
  //
  //   // compare before and after
  //   assert.isTrue(after.payer.lessThan(before.payer.minus(oneEther)), "payer"); // TODO take gas into account
  //   assert.isTrue(
  //     after.payee.equals(before.payee.plus(oneEther - donation)),
  //     "payee"
  //   );
  //   assert.isTrue(after.donee.equals(before.donee.plus(donation)), "donee");
  // });
});