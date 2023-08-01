import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { BookDAO } from "../../dao/books/BookDAO";
import { BookService } from "../../service/books/BooksService";
import { RouteMapper } from "../RouteChain";

class BookRouteMapper implements RouteMapper {
  private bookService: BookService;
  private endpoint: String;
  private method: String;
  private event: APIGatewayEvent;

  constructor(event: APIGatewayEvent) {
    this.event = event;
    this.bookService = new BookService(new BookDAO());
    this.endpoint = event.path;
    this.method = event.httpMethod;
  }

  public async mapRoute(): Promise<APIGatewayProxyResult> {
    if (this.endpoint.includes("/books")) {
      const regex = /\/books\/(\d+)$/;
      const matches = this.endpoint.match(regex);
      let bookId = "";
      if (matches && matches.length > 1) {
        bookId = matches[1];
        console.log("bookId: " + bookId);
      } else {
        console.log("Nessun path parameter trovato.");
      }

      if (bookId == "") {
        console.log("bookId is empty");
        switch (this.method) {
          case "GET": {
            try {
              const books = await this.bookService.GetAll();
              return {
                statusCode: 200,
                body: JSON.stringify(books),
              };
            } catch (error) {
              console.error("An error ocurred:", error);
              return {
                statusCode: 500,
                body: JSON.stringify(error),
              };
            }
          }

          case "POST": {
            try {
              await this.bookService.Create(JSON.parse(this.event.body));
              return {
                statusCode: 201,
                body: "Book created",
              };
            } catch (error) {
              console.error("An error ocurred:", error);
              return {
                statusCode: 500,
                body: JSON.stringify(error),
              };
            }
          }
        }
        return;
      }

      switch (this.method) {
        case "GET": {
          try {
            const book = await this.bookService.Get(
              bookId as unknown as number
            );
            console.log("book: ", book);
            if (book) {
              return {
                statusCode: 200,
                body: JSON.stringify(book),
              };
            }
            console.log("Book not found");
            return {
              statusCode: 404,
              body: "Book not found",
            };
          } catch (error) {
            console.error("An error ocurred:", error);
            return {
              statusCode: 500,
              body: JSON.stringify(error),
            };
          }
        }
        case "PUT": {
          try {
            this.bookService.Update(
              bookId as unknown as number,
              JSON.parse(this.event.body)
            );
            return {
              statusCode: 200,
              body: "Book updated",
            };
          } catch (error) {
            return {
              statusCode: 500,
              body: JSON.stringify(error),
            };
          }
        }
        case "DELETE": {
          try {
            const book = await this.bookService.Delete(
              bookId as unknown as number
            );
            return {
              statusCode: 200,
              body: "Book deleted",
            };
          } catch (error) {
            return {
              statusCode: 500,
              body: JSON.stringify(error),
            };
          }
        }
      }
    }
  }
}

export default BookRouteMapper;
