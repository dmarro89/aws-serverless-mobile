import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { BookDAO } from "../../dao/books/BookDAO";
import { Book } from "../../model/books/Book";

const tableName = "BOOKS";

export class BookService implements Service<number, Book, Book[] | Book> {
  private BookDAO: BookDAO;

  constructor(BookDAO: BookDAO) {
    this.BookDAO = BookDAO;
  }

  async Create(data: Book) {
    console.log(
      "Creating book with id: " + data.id + " from table: " + tableName
    );
    const params = {
      TableName: tableName,
      Item: marshall(data),
    };

    this.BookDAO.Create(params);
  }

  async Update(id: number, data: Book) {
    console.log(
      "Updating book with id: " +
        id +
        " from table: " +
        tableName +
        " with data: " +
        JSON.stringify(data)
    );
    const params = {
      TableName: tableName,
      Key: { id: { N: String(id) } },
      UpdateExpression: "SET #attr1 = :val1, #attr2 = :val2, #attr3 = :val3",
      ExpressionAttributeNames: {
        "#attr1": "price",
        "#attr2": "title",
        "#attr3": "author",
      },
      ExpressionAttributeValues: {
        ":val1": { N: String(data.price) },
        ":val2": { S: data.title },
        ":val3": { S: data.author },
      },
    };

    this.BookDAO.Update(params);
  }

  async Delete(id: number) {
    console.log("Deleting book with id: " + id + " from table: " + tableName);
    const params = {
      TableName: tableName,
      Key: { id: { N: String(id) } },
    };

    this.BookDAO.Delete(params);
  }

  async GetAll(): Promise<Book[]> {
    console.log("Getting all books from table: " + tableName);
    const params = {
      TableName: tableName,
    };

    console.log("Getting All Books");
    const { Items } = await this.BookDAO.GetAll(params);
    const books = Items.map((item) => unmarshall(item)) as Book[];
    console.log("Got All Books:", books);
    return books;
  }

  async Get(id: number): Promise<Book> {
    console.log("Getting book with id: " + id + " from table: " + tableName);
    const params = {
      TableName: tableName,
      Key: {
        id: { N: String(id) },
      },
    };

    const { Item } = await this.BookDAO.Get(params);
    console.log("Got Book:", Item);
    if (Item !== undefined && Item !== null) {
      console.log("Existing Book:", Item);
      const book = unmarshall(Item) as Book;
      console.log("Got Book:", book);
      return book;
    }
    return null;
  }
}
