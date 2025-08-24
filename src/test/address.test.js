import supertest from "supertest";
import { createTestAddress, createTestContact, createTestUser, getTestAddress, getTestContact, removeAllTestAddresses, removeAllTestContacts, removeTestUser } from "./test-util";
import { web } from "../application/web";

describe('POST /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can create new address', async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .post(`/api/contacts/${testContact.id}/addresses`)
            .set('Authorization', 'test')
            .send({
                street: 'Jl. Test',
                city: 'Test City',
                province: 'Test Province',
                country: 'Test Country',
                postal_code: '12345',
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.street).toBe('Jl. Test');
        expect(result.body.data.city).toBe('Test City');
        expect(result.body.data.province).toBe('Test Province');
        expect(result.body.data.country).toBe('Test Country');
        expect(result.body.data.postal_code).toBe('12345');
    });

    it('should reject if address request is invalid', async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .post(`/api/contacts/${testContact.id}/addresses`)
            .set('Authorization', 'test')
            .send({
                street: 'Jl. Test',
                city: 'Test City',
                province: 'Test Province',
                country: '',
                postal_code: '',
            });

        expect(result.status).toBe(400);
    });

    it('should reject if contact is not found', async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .post(`/api/contacts/${testContact.id + 1}/addresses`)
            .set('Authorization', 'test')
            .send({
                street: 'Jl. Test',
                city: 'Test City',
                province: 'Test Province',
                country: '',
                postal_code: '',
            });

        expect(result.status).toBe(404);
    });
});

describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can get contact', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .get('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.street).toBe('Jl. Test');
        expect(result.body.data.city).toBe('Test City');
        expect(result.body.data.province).toBe('Test Province');
        expect(result.body.data.country).toBe('Test Country');
        expect(result.body.data.postal_code).toBe('12345');
    });

    it('should reject if contact is not found', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .get('/api/contacts/' + (testContact.id + 1) + '/addresses/' + testAddress.id)
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });

    it('should reject if address is not found', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .get('/api/contacts/' + testContact.id + '/addresses/' + (testAddress.id + 1))
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });
});

describe('PUT /api/contacts/:contactId/addresses/:addressId', function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can update address', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .put('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
            .set('Authorization', 'test')
            .send({
                street: 'Jl. Test Updated',
                city: 'Test City Updated',
                province: 'Test Province Updated',
                country: 'Test Country Updated',
                postal_code: '12345',
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testAddress.id);
        expect(result.body.data.street).toBe("Jl. Test Updated");
        expect(result.body.data.city).toBe("Test City Updated");
        expect(result.body.data.province).toBe("Test Province Updated");
        expect(result.body.data.country).toBe("Test Country Updated");
        expect(result.body.data.postal_code).toBe("12345");
    });

    it('should reject if request is not valid', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .put('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
            .set('Authorization', 'test')
            .send({
                street: 'Test Street',
                city: 'Test City',
                province: 'Test Province',
                country: '',
                postal_code: ''
            });

        expect(result.status).toBe(400);
    });

    it('should reject if address is not found', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .put('/api/contacts/' + testContact.id + '/addresses/' + (testAddress.id + 1))
            .set('Authorization', 'test')
            .send({
                street: 'Test Street',
                city: 'Test City',
                province: 'Test Province',
                country: 'indonesia',
                postal_code: '2312323'
            });

        expect(result.status).toBe(404);
    });

    it('should reject if contact is not found', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .put('/api/contacts/' + (testContact.id + 1) + '/addresses/' + testAddress.id)
            .set('Authorization', 'test')
            .send({
                street: 'Test Street',
                city: 'Test City',
                province: 'Test Province',
                country: 'indonesia',
                postal_code: '2312323'
            });

        expect(result.status).toBe(404);
    });
});

describe('DELETE /api/contacts/:contactId/addresses/:addressId', function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can remove address', async () => {
        const testContact = await getTestContact();
        let testAddress = await getTestAddress();

        const result = await supertest(web)
            .delete('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data).toBe("Address deleted successfully");

        testAddress = await getTestAddress();
        expect(testAddress).toBeNull();
    });

    it('should reject if address is not found', async () => {
        const testContact = await getTestContact();
        let testAddress = await getTestAddress();

        const result = await supertest(web)
            .delete('/api/contacts/' + testContact.id + '/addresses/' + (testAddress.id + 1))
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });

    it('should reject if contact is not found', async () => {
        const testContact = await getTestContact();
        let testAddress = await getTestAddress();

        const result = await supertest(web)
            .delete('/api/contacts/' + (testContact.id + 1) + '/addresses/' + testAddress.id)
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });
});

describe('GET /api/contacts/:contactId/addresses', function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can list addresses', async function () {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .get('/api/contacts/' + testContact.id + "/addresses")
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(1);
    });

    it('should reject if contact is not found', async function () {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .get('/api/contacts/' + (testContact.id + 1) + "/addresses")
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });
});