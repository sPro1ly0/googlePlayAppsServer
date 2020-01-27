const supertest = require('supertest');
const app  = require('../app');
const { expect } = require('chai');

describe('GET /apps', () => {
    it('should return an array of apps', () => {
        return supertest(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                const gameApp = res.body[0];
                expect(gameApp).to.be.an('object');
                expect(gameApp).to.include.all.keys(
                    'App', 'Rating', 'Genres'
                );
            });
    });

    it('should return 400 if sort is incorrect', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'INCORRECT' })
            .expect(400, 'Sort must be App or Rating')
    });

    it('should return 400 if genres is incorrect', () => {
        return supertest(app)
            .get('/apps')
            .query({ genres: 'INCORRECT' })
            .expect(400, 'Genres must be one of the following: Action, Puzzle, Strategy, Casual, Arcade, or Card.')
    });

    it('should return an app based on search query', () => {
        return supertest(app)
            .get('/apps')
            .query({ search: 'Hello'})
            .expect(200)
            .then(res => {
                expect(res.body).to.be.an('array');
                //console.log(res.body); Hello Kitty
            });
    });

    it('should return all apps if search query is empty', () => {
        return supertest(app)
            .get('/apps')
            .query({ search: ''})
            .expect(200)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                const gameApp = res.body[0];
                expect(gameApp).to.be.an('object');
                expect(gameApp).to.include.all.keys(
                    'App', 'Rating', 'Genres'
                );
            });
    });

    it(`should sort by App's name`, () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'App' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;
                let i = 0;

                while (i < res.body.length - 1) {
                    const appAtI = res.body[i];
                    const appAtIPlus1 = res.body[i + 1];

                    if (appAtIPlus1.App.toLowerCase() < appAtI.App.toLowerCase()) {
                        sorted = false;
                        break;
                    }
                    i++;
                }
                expect(sorted).to.be.true;
            });
    });

    it(`should sort by App's Rating from highest to lowest rating`, () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'Rating'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;
                let i = 0;

                while (i < res.body.length - 1) {
                    const appAtI = res.body[i];
                    const appAtIPlus1 = res.body[i + 1];

                    if (appAtI.Rating < appAtIPlus1.Rating) {
                        sorted = false;
                        break;
                    }
                    i++;
                }
                expect(sorted).to.be.true;
            });
    });

    it(`should return an array of apps with correct Genres`, () => {
        return supertest(app)
            .get('/apps')
            .query({ genres: 'Action' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                const gameApp = res.body[0];
                expect(gameApp).to.be.an('object');
                expect(gameApp).to.have.a.property('Genres');
            });
    });

    it(`should return sorted App's names with Genres filter`, () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'App', genres: 'Action' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                let sorted = true;
                let i = 0;

                while (i < res.body.length - 1) {
                    const appAtI = res.body[i];
                    const appAtIPlus1 = res.body[i + 1];

                    if (appAtIPlus1.App.toLowerCase() < appAtI.App.toLowerCase()) {
                        sorted = false;
                        break;
                    }
                    i++;
                }
                expect(sorted).to.be.true;
                //console.log(res.body);
            });
    });

    it(`should return sorted App's Ratings with Genres filter`, () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'Rating', genres: 'Action' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;
                let i = 0;

                while (i < res.body.length - 1) {
                    const appAtI = res.body[i];
                    const appAtIPlus1 = res.body[i + 1];

                    if (appAtI.Rating < appAtIPlus1.Rating) {
                        sorted = false;
                        break;
                    }
                    i++;
                }
                expect(sorted).to.be.true;
                //console.log(res.body);
            });
    });

});
