process.env.NODE_ENV = "test";

import chai from "chai";
import app from "../../app";
import chaiHttp from 'chai-http';

const expect = chai.expect;
chai.use(chaiHttp);

describe("Api Test", function (): void {
  it("should be able to create a test", (done: Function): void => {
    chai.request(app)
      .post("/api/tests")
      .set("content-type", "application/json")
      .send({
        name: "Pipz",
        job: "Diswasher"
      })
      .end((err: Error, res: any): void => {
        expect(res.statusCode).to.be.equal(201);
        expect(res.body.name).to.be.equal("Pipz");
        expect(res.body.job).to.be.equal("Diswasher");
        done();
      });
  });

  it("should be able to get all test", (done: Function): void => {
    chai.request(app)
      .get("/api/tests")
      .end((err: Error, res: any): void => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
});