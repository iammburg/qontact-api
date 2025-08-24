import { prismaClient } from "../application/database.js";
import bcrypt from "bcrypt";

export const removeTestUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: 'test',
        },
    });
};

export const createTestUser = async () => {
    await prismaClient.user.create({
        data: {
            username: 'test',
            password: await bcrypt.hash('rahasiaa', 10),
            name: 'Test',
            token: 'test'
        }
    });
};

export const getTestUser = async () => {
    return prismaClient.user.findUnique({
        where: {
            username: 'test',
        },
    });
};

export const removeAllTestContacts = async () => {
    await prismaClient.contact.deleteMany({
        where: {
            username: 'test',
        },
    });
};

export const createTestContact = async () => {
    await prismaClient.contact.create({
        data: {
            username: 'test',
            first_name: 'test',
            last_name: 'test',
            email: 'test@gmail.com',
            phone: '08123456789',
        }
    });
};

export const createManyTestContact = async () => {
    for (let i = 0; i < 15; i++) {
        await prismaClient.contact.create({
            data: {
                username: 'test',
                first_name: `test ${i}`,
                last_name: `test ${i}`,
                email: `test${i}@gmail.com`,
                phone: `0800000000${i}`,
            }
        });
    }
};

export const getTestContact = async () => {
    return prismaClient.contact.findFirst({
        where: {
            username: 'test',
        },
    });
};

export const removeAllTestAddresses = async () => {
    await prismaClient.address.deleteMany({
        where: {
            contact: {
                username: 'test',
            },
        },
    });
};

export const createTestAddress = async () => {
    const contact = await getTestContact();
    await prismaClient.address.create({
        data: {
            contact_id: contact.id,
            street: 'Jl. Test',
            city: 'Test City',
            province: 'Test Province',
            country: 'Test Country',
            postal_code: '12345',
        }
    });
};

export const getTestAddress = async () => {
    return prismaClient.address.findFirst({
        where: {
            contact: {
                username: 'test',
            },
        },
    });
};