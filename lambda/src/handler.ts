import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import BookRouteMapper from "./route/books/BooksRoutes";
import { RouteChain } from "./route/RouteChain";

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  return new RouteChain([new BookRouteMapper(event)]).invoke();
};
