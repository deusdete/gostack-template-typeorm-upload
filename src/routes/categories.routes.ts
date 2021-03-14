import { request, response, Router } from 'express';
import { getRepository } from 'typeorm';
import Category from '../models/Category';

const categoriesReuter = Router();

categoriesReuter.get('/', async (request, response) => {
  const categoriesRepository = getRepository(Category);

  const categories = await categoriesRepository.find();

  return response.json({ categories });
});

categoriesReuter.post('/', async (request, response) => {
  const { title } = request.body;

  const categoriesRepository = getRepository(Category);

  const { identifiers } = await categoriesRepository.insert({
    title,
  });

  return response.json(identifiers);
});

export default categoriesReuter;
