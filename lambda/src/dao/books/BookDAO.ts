import {
  CreateTableCommand,
  CreateTableCommandInput,
  CreateTableCommandOutput,
  CreateTableInput,
  DeleteItemCommand,
  DeleteItemCommandInput,
  DeleteItemCommandOutput,
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandInput,
  GetItemCommandOutput,
  PutItemCommand,
  PutItemCommandInput,
  PutItemCommandOutput,
  PutItemInput,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
  UpdateItemCommand,
  UpdateItemCommandInput,
  UpdateItemCommandOutput,
  UpdateItemInput,
} from "@aws-sdk/client-dynamodb";

export class BookDAO
  implements
    DAO<
      UpdateItemInput | CreateTableInput | PutItemInput,
      | CreateTableCommandOutput
      | PutItemCommandOutput
      | DeleteItemCommandOutput
      | ScanCommandOutput
      | UpdateItemCommandOutput
      | GetItemCommandOutput
    >
{
  private client: DynamoDBClient;

  constructor() {
    const region = process.env.AWS_REGION;
    this.client = new DynamoDBClient({ region });
  }

  async Create(input: PutItemCommandInput): Promise<PutItemCommandOutput> {
    return this.client.send(new PutItemCommand(input));
  }

  async Update(input: UpdateItemCommandInput): Promise<PutItemCommandOutput> {
    return this.client.send(new UpdateItemCommand(input));
  }

  async Delete(
    input: DeleteItemCommandInput
  ): Promise<DeleteItemCommandOutput> {
    return this.client.send(new DeleteItemCommand(input));
  }

  async GetAll(input: ScanCommandInput): Promise<ScanCommandOutput> {
    return this.client.send(new ScanCommand(input));
  }

  async Get(input: GetItemCommandInput): Promise<GetItemCommandOutput> {
    return this.client.send(new GetItemCommand(input));
  }
}
