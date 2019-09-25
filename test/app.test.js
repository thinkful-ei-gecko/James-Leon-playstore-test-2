const {expect} = require('chai');
const supertest = require('supertest');
const app = require('../app');
const storeData = require('../playstore.js')

describe('app component', () => {
  describe('/GET apps', () => {

    it('return successfully without query parameters', () => {
      return supertest(app)
        .get('/apps')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf.at.least(1);
          expect(res.body).to.deep.equal(storeData);
        });
    });

    ['App','Rating'].forEach(check => {
      it(`sorts appropriately by ${check}`, () => {
        return supertest(app)
          .get('/apps')
          .expect(200)
          .query({sort: check})
          .expect('Content-Type', /json/)
          .then(res => {
            expect(res.body).to.be.an('array');
            let i = 0, sorted = true;
            while (sorted && i < res.body.length - 1) {
              sorted = sorted && res.body[i][check] <= res.body[i + 1][check];
              i++;
            }
            expect(sorted).to.be.true;
          });
      });
    });
    
    it('sort is an invalid term', () => {
      return supertest(app)
        .get('/apps')
        .query({sort: 'XXX'})
        .expect('Content-Type', /html/)
        .expect(400, 'Sort must of one of rating or app')
    });

    ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].forEach(type => {
      it(`returns apps sorted by genre ${type}`, () => {
        return supertest(app)
          .get('/apps')
          .query({genres: type})
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            expect(res.body).to.be.an('array')
            let testMethod = res.body.every(app => app.Genres.includes(type))
            expect(testMethod).to.be.true
            // let i=0, filtered=true;
            // while(filtered && i < res.body.length - 1){
            //   if(!res.body[i]['Genres'].includes(type)){
            //     filtered=false;
            //   }
            //   i++
            // }
          })
      })
    })
  });
});