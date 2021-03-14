import csvParse from 'csv-parse';
import fs from 'fs';
import { getRepository, In } from 'typeorm';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}
class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const categoryRepository = getRepository(Category);
    const transactionRepository = getRepository(Transaction);

    const contactsReadStream = fs.createReadStream(filePath);

    const parsers = csvParse({
      from_line: 2,
    });

    const parseCsv = contactsReadStream.pipe(parsers);

    const transactions: CSVTransaction[] = [];
    const categories: string[] = [];

    parseCsv.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category);
      transactions.push({
        title,
        type,
        value,
        category,
      });
    });

    await new Promise(resolve => parseCsv.on('end', resolve));

    const existentCategories = await categoryRepository.find({
      where: In(categories),
    });

    const existentCategoriesTitles = existentCategories.map(
      (category: Category) => category.title,
    );

    const addCategoryTitle = categories
      .filter(category => !existentCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const addNewCategory = categoryRepository.create(
      addCategoryTitle.map(title => ({ title })),
    );

    await categoryRepository.save(addNewCategory);

    const finalCategory = [...addNewCategory, ...existentCategories];

    const createTransactions = transactionRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategory.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionRepository.save(createTransactions);

    await fs.promises.unlink(filePath);

    return createTransactions;
  }
}

export default ImportTransactionsService;
