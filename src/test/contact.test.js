import { web } from "../application/web.js";
import supertest from "supertest";
import { createManyTestContact, createTestContact, createTestUser, getTestContact, removeAllTestContacts, removeTestUser } from "./test-util.js";
import { logger } from "../application/logging.js";

describe('POST /api/contacts', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can create new contact', async () => {
        const result = await supertest(web)
            .post('/api/contacts')
            .set('Authorization', 'test')
            .send({
                first_name: 'Nda',
                last_name: 'Ru',
                email: 'ndaru@gmail.com',
                phone: '08123456789',
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.first_name).toBe('Nda');
        expect(result.body.data.last_name).toBe('Ru');
        expect(result.body.data.email).toBe('ndaru@gmail.com');
        expect(result.body.data.phone).toBe('08123456789');
    });

    it('should reject if request is not valid', async () => {
        const result = await supertest(web)
            .post('/api/contacts')
            .set('Authorization', 'test')
            .send({
                first_name: '',
                last_name: 'Ru',
                email: 'ndaru@gmail.com',
                phone: '081234567890000000000000000000002342432',
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe('GET /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can get contact', async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .get(`/api/contacts/${testContact.id}`)
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testContact.id);
        expect(result.body.data.first_name).toBe(testContact.first_name);
        expect(result.body.data.last_name).toBe(testContact.last_name);
        expect(result.body.data.email).toBe(testContact.email);
        expect(result.body.data.phone).toBe(testContact.phone);
    });

    it('should return 404 if contact id is not found', async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .get(`/api/contacts/${testContact.id + 1}`)
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });

});

describe('PUT /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can update existing contact', async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .put(`/api/contacts/${testContact.id}`)
            .set('Authorization', 'test')
            .send({
                first_name: 'Nda Updated',
                last_name: 'Ru Updated',
                email: 'ndaru99@gmail.com',
                phone: '08111111111',
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testContact.id);
        expect(result.body.data.first_name).toBe('Nda Updated');
        expect(result.body.data.last_name).toBe('Ru Updated');
        expect(result.body.data.email).toBe('ndaru99@gmail.com');
        expect(result.body.data.phone).toBe('08111111111');
    });

    it('should reject if request is invalid', async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .put(`/api/contacts/${testContact.id}`)
            .set('Authorization', 'test')
            .send({
                first_name: '',
                last_name: '',
                email: 'ndaru99',
                phone: '',
            });

        expect(result.status).toBe(400);
    });

    it('should reject if contact is not found', async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .put(`/api/contacts/${testContact.id + 1}`)
            .set('Authorization', 'test')
            .send({
                first_name: 'Nda Updated',
                last_name: 'Ru Updated',
                email: 'ndaru99@gmail.com',
                phone: '08111111111',
            });

        expect(result.status).toBe(404);
    });

});

describe('DELETE /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can delete contact', async () => {
        let testContact = await getTestContact();

        const result = await supertest(web)
            .delete(`/api/contacts/${testContact.id}`)
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data).toBe("Contact deleted successfully");

        testContact = await getTestContact();
        expect(testContact).toBeNull();
    });

    it('should reject if contact is not found', async () => {
        let testContact = await getTestContact();

        const result = await supertest(web)
            .delete(`/api/contacts/${testContact.id + 1}`)
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });
});


describe('GET /api/contacts', () => {
    beforeEach(async () => {
        await createTestUser();
        await createManyTestContact();
    });

    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can search without parameter', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(10);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_item).toBe(15);
    });

    it('should can search to page 2', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({
                page: 2,
            })
            .set('Authorization', 'test');

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(5);
        expect(result.body.paging.page).toBe(2);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_item).toBe(15);
    });

    it('should can search using name', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({
                name: "test 1",
            })
            .set('Authorization', 'test');

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });

    it('should can search using email', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({
                email: "test1",
            })
            .set('Authorization', 'test');

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });

    it('should can search using phone', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({
                phone: "08000000001",
            })
            .set('Authorization', 'test');

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });

});
