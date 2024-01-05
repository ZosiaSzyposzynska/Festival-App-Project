const server = require('../../../server');

const chai = require('chai');
const chaiHttp = require('chai-http');

const Concert = require('../../../models/concerts.model');
chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe ('Concerts', () => {


    before(async () => {
        const testConcertOne = new Concert({ performer: 'Performer1', genre: 'Genre1', price: 50, day: 1, image: '/img/uploads/1fsd324fsdg.jpg' });
        await testConcertOne.save();

        const testConcertTwo = new Concert({ performer: 'Performer2', genre: 'Genre2', price: 70, day: 2, image: '/img/uploads/hdfh42sd213.jpg' });
        await testConcertTwo.save();
    });


    it('should return concerts by performer', async () => {
        const res = await request(server).get('/api/concerts/performer/Performer1');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(1);
        expect(res.body[0].performer).to.equal('Performer1');
    });

      it('should return concerts by genre', async () => {
        const res = await request(server).get('/api/concerts/genre/Genre1');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(1);
        expect(res.body[0].genre).to.equal('Genre1');
    });


      it('should return concerts with the price range', async () => {
        const res = await request(server).get('/api/concerts/price/50/60');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(1);
    });

    it('should return concerts by day', async () => {
        const res = await request(server).get('/api/concerts/day/1');

        console.log(res.body);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(1);
        expect(res.body[0].day).to.equal(1);
    });


    after(async () => {
        await Concert.deleteMany();
    });

})
