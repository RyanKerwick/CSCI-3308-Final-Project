// ********************** Initialize server **********************************

const server = require('../index'); //TODO: Make sure the path to your index.js is correctly added

// ********************** Import Libraries ***********************************

const chai = require('chai'); // Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;


// *********************** UNIT TESTCASES **************************


// describe('Testing Register API', () => {

//   // Register Positive Testcase :
//   // API: /register
//   // Input: {username: 'John Doe', password: 'abcdefg'}
//   // Expect: res.status == 200 and res.body.message == 'Success'
//   // Result: This test case should pass and return a status 200 along with a "Success" message.
//   // Explanation: The testcase will call the /register API with the following input
//   // and expects the API to return a status of 200 along with the "Success" message.

//   it('positive : /register', done => {
//     chai
//       .request(server)
//       .post('/register')
//       .send({username: 'John Doe', password: 'abcdefg'})
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body.message).to.equals('Success');
//         done();
//       });
//   });


//   // Register Negative Testcase :
//   // API: /register
//   // Input: {username: 'John Doe', password: 'abadaba'}
//   // Expect: res.status == 400 and res.body.message == 'Invalid input'
//   // Result: This test case should pass and return a status 400 along with a "Invalid input" message.
//   // Explanation: The testcase will call the /register API with the following invalid inputs
//   // and expects the API to return a status of 400 along with the "Invalid input" message.

//   it('Negative : /register. Checking invalid name', done => {
//     chai
//       .request(server)
//       .post('/register')
//       .send({username: 'John Doe', password: 'abadaba'})
//       .end((err, res) => {
//         expect(res).to.have.status(400);
//         expect(res.body.message).to.equals('Invalid input');
//         done();
//       });
//   });
// });




// describe('Testing Login API', () => {
//   // Login Positive Testcase :
//   // API: /login
//   // Input: {username: 'John Doe', password: 'abcdefg'}
//   // Expect: res.status == 200 and res.body.message == 'Success'

//   it('positive : /login. Checking User Acceptance', done => {
//     chai
//       .request(server)
//       .post('/login')
//       .send({username: 'John Doe', password: 'abcdefg'})
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body.message).to.equals('Success');
//         done();
//       });
//   });

//   // Login Negative Testcase :
//   // API: /login
//   // Input: {username: 'John Doe', password: 'abadaba'}
//   // Expect: res.status == 400 and res.body.message == 'Invalid input'

//   it('Negative : /login. Checking invalid password', done => {
//     chai
//       .request(server)
//       .post('/login')
//       .send({username: 'John Doe', password: 'abadaba'})
//       .end((err, res) => {
//         expect(res).to.have.status(400);
//         expect(res.body.message).to.equals('Invalid input');
//         done();
//       });
//   });

//   // Login Negative Testcase :
//   // API: /login
//   // Input: {username: 'Jane Woe', password: 'abcdefg'}
//   // Expect: res.status == 400 and res.body.message == 'Invalid input'

//   it('Negative : /login. Checking invalid username', done => {
//     chai
//       .request(server)
//       .post('/login')
//       .send({username: 'Jane Woe', password: 'abcdefg'})
//       .end((err, res) => {
//         expect(res).to.have.status(400);
//         expect(res.body.message).to.equals('Invalid input');
//         done();
//       });
//   });
// });
// // ********************************************************************************


// describe('Testing Wishlist API', () => {

//   // Wishlist Positive Testcase :
//   // API: /wishlist
//   // Input: {item_id = 1}
//   // Expect: res.status == 200 and res.body.message == 'Success'
//   // Result: This test case should pass and return a status 200 along with a "Success" message.
//   // Explanation: The testcase will call the /wishlist API with the following input
//   // and expects the API to return a status of 200 along with the "Success" message.

//   it('positive : /wishlist', done => {
//     chai
//       .request(server)
//       .post('wishlist')
//       .send({item_id: 1})
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body.message).to.equals('Success');
//         done();
//       });
//   });

//   // Wishlist Negative Testcase :
//   // API: /wishlist
//   // Input: {item_id = 100}, out of range
//   // Expect: res.status == 200 and res.body.message == 'Success'
//   // Result: This test case should pass and return a status 400 along with a "Invalid input" message.
//   // Explanation: The testcase will call the /wishlist API with the following invalid inputs
//   // and expects the API to return a status of 400 along with the "Invalid input" message.

//   it('negative : /wishlist', done => {
//     chai
//       .request(server)
//       .post('wishlist')
//       .send({item_id: 100})
//       .end((err, res) => {
//         expect(res).to.have.status(400);
//         expect(res.body.message).to.equals('Success');
//         done();
//       })
//   })
// });


describe('Testing Profile API', () => {

  it('positive : /profile', done => {
    chai
      .request(server)
      .post('profile')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equals('Success');
        done();
      });
  });
});