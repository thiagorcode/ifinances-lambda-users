import { DynamoDbAdapter } from './../../adapter/dynamodb/dynamodb.adapter'
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb'

jest.mock('@aws-sdk/lib-dynamodb', () => ({
  DynamoDB: jest.fn(),
  DynamoDBDocumentClient: {
    from: jest.fn(() => ({
      send: jest.fn(),
    })),
  },
  GetCommand: jest.fn(),
  PutCommand: jest.fn(),
  UpdateCommand: jest.fn(),
  QueryCommand: jest.fn(),
  ScanCommand: jest.fn(),
}))

describe('DynamoDbAdapter', () => {
  let dynamoDbAdapter: DynamoDbAdapter
  let mockDynamoDBDocumentClient: any

  beforeEach(() => {
    mockDynamoDBDocumentClient = DynamoDBDocumentClient.from({}) as jest.Mocked<DynamoDBDocumentClient>
    dynamoDbAdapter = new DynamoDbAdapter('TestTable', 'id')
  })

  it('should add an item', async () => {
    const data = { id: '1', name: 'Test' }
    const mockSend = jest.spyOn(mockDynamoDBDocumentClient, 'send').mockResolvedValue({})

    await dynamoDbAdapter.add(data)

    expect(PutCommand).toHaveBeenCalledWith({
      TableName: 'TestTable',
      Item: data,
    })
    expect(mockSend).toHaveBeenCalled()
  })

  it('should get an item by ID', async () => {
    const data = { id: '1', name: 'Test' }
    const mockSend = jest.spyOn(mockDynamoDBDocumentClient, 'send').mockResolvedValue({ Item: data })

    const result = await dynamoDbAdapter.get('1')

    expect(GetCommand).toHaveBeenCalledWith({
      TableName: 'TestTable',
      Key: { id: '1' },
    })
    expect(mockSend).toHaveBeenCalled()
    expect(result).toEqual(data)
  })

  it('should update an item', async () => {
    const data = { id: '1', name: 'Updated Test' }
    const mockSend = jest.spyOn(mockDynamoDBDocumentClient, 'send').mockResolvedValue({})

    await dynamoDbAdapter.update(data)

    expect(UpdateCommand).toHaveBeenCalled()
    expect(mockSend).toHaveBeenCalled()
  })

  it('should scan items with filters', async () => {
    const data = [{ id: '1', name: 'Test' }]
    const mockSend = jest.spyOn(mockDynamoDBDocumentClient, 'send').mockResolvedValue({ Items: data })

    const result = await dynamoDbAdapter.scan()

    expect(ScanCommand).toHaveBeenCalledWith({
      TableName: 'TestTable',
      IndexName: undefined,
      FilterExpression: '',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
    })
    expect(mockSend).toHaveBeenCalled()
    expect(result).toEqual(data)
  })

  it('should query items by partition key with filters', async () => {
    const data = [{ id: '1', name: 'Test' }]
    const mockSend = jest.spyOn(mockDynamoDBDocumentClient, 'send').mockResolvedValue({ Items: data })

    const result = await dynamoDbAdapter.query('1', [])

    expect(QueryCommand).toHaveBeenCalled()
    expect(mockSend).toHaveBeenCalled()
    expect(result).toEqual(data)
  })
})
