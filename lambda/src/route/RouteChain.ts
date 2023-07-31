// HandlerChain.ts
import { APIGatewayProxyResult } from "aws-lambda";

export interface RouteMapper {
  mapRoute(
  ): Promise<APIGatewayProxyResult>;
}

export class RouteChain {
  private handlers: RouteMapper[];

  constructor(handlers: RouteMapper[]) {
    this.handlers = handlers;
  }

  public async invoke(): Promise<APIGatewayProxyResult> {
    for (const handler of this.handlers) {
      const result = await handler.mapRoute();
      if (result) {
        return result;
      }
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Endpoint not found" }),
    };
  }
}
