process.env.NODE_ENV = "test";

import chai from "chai";
import app from "../../app";
import chaiHttp from 'chai-http';

const expect = chai.expect;
chai.use(chaiHttp);

describe("User Api Test", function (): void {

    it("should validate valid email", (done: Function): void => {
        const data = {
            email: "Invalid email",
            username: "chefpipz",
            password: "Passw0rd",
            confirmPassword: "Passw0rd"
        };
        chai.request(app)
            .post("/api/users/register")
            .set("content-type", "application/json")
            .send(data)
            .end((err: Error, res: any): void => {
                const body = res.body;
                expect(res.statusCode).to.be.equal(400);
                expect(body).to.have.property('errors');
                expect(body.errors).to.be.a('array');
                expect(body.errors.length).to.be.equal(1);
                expect(body.errors[0].value).to.be.equal(data.email);
                expect(body.errors[0].msg).to.be.equal("must be an email.");
                expect(body.errors[0].param).to.be.equal("email");
                done();
            });
    });

    it("should validate password", (done: Function): void => {
        const data = {
            email: "chefpipz@gmail.com",
            username: "chefpipz",
            password: "a123",
            confirmPassword: "a123"
        };
        chai.request(app)
            .post("/api/users/register")
            .set("content-type", "application/json")
            .send(data)
            .end((err: Error, res: any): void => {
                const body = res.body;
                expect(res.statusCode).to.be.equal(400);
                expect(body).to.have.property('errors');
                expect(body.errors).to.be.a('array');
                expect(body.errors.length).to.be.equal(1);
                expect(body.errors[0].value).to.be.equal(data.password);
                expect(body.errors[0].msg).to.be.equal("must be 6 to 20 characters only.");
                expect(body.errors[0].param).to.be.equal("password");
                done();
            });
    });

    it("should validate password v2", (done: Function): void => {
        const data = {
            email: "chefpipz@gmail.com",
            username: "testvalidation",
            password: "123456789123456789001234567890",
            confirmPassword: "123456789123456789001234567890"
        };
        chai.request(app)
            .post("/api/users/register")
            .set("content-type", "application/json")
            .send(data)
            .end((err: Error, res: any): void => {
                const body = res.body;
                expect(res.statusCode).to.be.equal(400);
                expect(body).to.have.property('errors');
                expect(body.errors).to.be.a('array');
                expect(body.errors.length).to.be.equal(1);
                expect(body.errors[0].value).to.be.equal(data.password);
                expect(body.errors[0].msg).to.be.equal("must be 6 to 20 characters only.");
                expect(body.errors[0].param).to.be.equal("password");
                done();
            });
    });

    it("should validate username", (done: Function): void => {
        const data = {
            email: "chefpipz@gmail.com",
            username: "",
            password: "admin123",
            confirmPassword: "admin123"
        };
        chai.request(app)
            .post("/api/users/register")
            .set("content-type", "application/json")
            .send(data)
            .end((err: Error, res: any): void => {
                const body = res.body;
                expect(res.statusCode).to.be.equal(400);
                expect(body).to.have.property('errors');
                expect(body.errors).to.be.a('array');
                expect(body.errors.length).to.be.equal(1);
                expect(body.errors[0].value).to.be.equal(data.username);
                expect(body.errors[0].msg).to.be.equal("Username is required.");
                expect(body.errors[0].param).to.be.equal("username");
                done();
            });
    });

    it("should be able to create a user", (done: Function): void => {
        const data = {
            email: "chefpipz@gmail.com",
            username: "chefpipz",
            password: "Passw0rd",
            confirmPassword: "Passw0rd"
        };
        chai.request(app)
            .post("/api/users/register")
            .set("content-type", "application/json")
            .send(data)
            .end((err: Error, res: any): void => {
                const body = res.body;
                expect(res.statusCode).to.be.equal(201);
                expect(body).to.have.property('user');
                expect(body.user).to.have.property('_id');
                expect(body.user).to.have.property('email');
                expect(body.user).to.have.property('username');
                expect(body.user.username).to.be.equal(data.username);
                expect(body.user.email).to.be.equal(data.email);
                done();
            });
    });

    it("should handle existing email and username", (done: Function): void => {
        const data = {
            email: "chefpipz@gmail.com",
            username: "chefpipz",
            password: "Passw0rd",
            confirmPassword: "Passw0rd"
        };
        chai.request(app)
            .post("/api/users/register")
            .set("content-type", "application/json")
            .send(data)
            .end((err: Error, res: any): void => {
                const body = res.body;
                expect(res.statusCode).to.be.equal(400);
                expect(body).to.have.property('errors');
                expect(body.errors).to.be.a('array');
                expect(body.errors.length).to.be.equal(2);
                expect(body.errors[0].value).to.be.equal(data.email);
                expect(body.errors[0].msg).to.be.equal("Email already exists.");
                expect(body.errors[1].value).to.be.equal(data.username);
                expect(body.errors[1].msg).to.be.equal("Username already exists.");
                done();
            });
    });
});