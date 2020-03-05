import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Map;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.PropertiesCredentials;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient;
import com.amazonaws.services.dynamodbv2.model.AttributeDefinition;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.CreateTableRequest;
import com.amazonaws.services.dynamodbv2.model.CreateTableResult;
import com.amazonaws.services.dynamodbv2.model.DescribeTableRequest;
import com.amazonaws.services.dynamodbv2.model.KeySchemaElement;
import com.amazonaws.services.dynamodbv2.model.KeyType;
import com.amazonaws.services.dynamodbv2.model.ListTablesRequest;
import com.amazonaws.services.dynamodbv2.model.ListTablesResult;
import com.amazonaws.services.dynamodbv2.model.ProvisionedThroughput;
import com.amazonaws.services.dynamodbv2.model.ScanRequest;
import com.amazonaws.services.dynamodbv2.model.ScanResult;
import com.amazonaws.services.dynamodbv2.model.TableDescription;

public class DynamoDBClient {
	private String tableName = "Parameters";
	private AmazonDynamoDBClient client = null;

	public DynamoDBClient() throws IOException {
		AWSCredentials credentials = new PropertiesCredentials(
				DynamoDBClient.class.getResourceAsStream("AwsCredentials.properties"));
		client = new AmazonDynamoDBClient(credentials);
	}

	public void createTable() {
		logMessage("Creating table " + tableName);
		ArrayList<AttributeDefinition> attributeDefinitions = new ArrayList<AttributeDefinition>();
		attributeDefinitions.add(new AttributeDefinition().withAttributeName("Id").withAttributeType("N"));

		ArrayList<KeySchemaElement> ks = new ArrayList<KeySchemaElement>();
		ks.add(new KeySchemaElement().withAttributeName("Id").withKeyType(KeyType.HASH));

		ProvisionedThroughput provisionedThroughput = new ProvisionedThroughput().withReadCapacityUnits(10L)
				.withWriteCapacityUnits(10L);

		CreateTableRequest request = new CreateTableRequest().withTableName(tableName)
				.withAttributeDefinitions(attributeDefinitions).withKeySchema(ks)
				.withProvisionedThroughput(provisionedThroughput);

		CreateTableResult result = client.createTable(request);
		logMessage("Created table " + result.getTableDescription().getTableName());
	}

	public static void logMessage(String msg) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		System.out.println(sdf.format(new Date()) + " ==> " + msg);
	}

	public String getTableStatus() {
		TableDescription tableDescription = client.describeTable(new DescribeTableRequest().withTableName(tableName))
				.getTable();
		return tableDescription.getTableStatus();
	}

	public void describeTable() {
		logMessage("Describing table " + tableName);
		TableDescription tableDescription = client.describeTable(new DescribeTableRequest().withTableName(tableName))
				.getTable();
		String desc = String.format("%s: %s \t ReadCapacityUnits: %d \t WriteCapacityUnits: %d",
				tableDescription.getTableStatus(), tableDescription.getTableName(),
				tableDescription.getProvisionedThroughput().getReadCapacityUnits(),
				tableDescription.getProvisionedThroughput().getWriteCapacityUnits());
		logMessage(desc);
	}

	public void listTables() {
		logMessage("Listing tables");
		// Initial value for the first page of table names.
		String lastEvaluatedTableName = null;
		do {

			ListTablesRequest listTablesRequest = new ListTablesRequest().withLimit(10)
					.withExclusiveStartTableName(lastEvaluatedTableName);

			ListTablesResult result = client.listTables(listTablesRequest);
			lastEvaluatedTableName = result.getLastEvaluatedTableName();

			for (String name : result.getTableNames()) {
				logMessage(name);
			}

		} while (lastEvaluatedTableName != null);
	}

	public void listItems() {
		logMessage("List all items");
		ScanRequest scanRequest = new ScanRequest().withTableName(tableName);

		ScanResult result = client.scan(scanRequest);
		for (Map<String, AttributeValue> item : result.getItems()) {
			printItem(item);
		}
	}

	private void printItem(Map<String, AttributeValue> attributeList) {
		String itemString = new String();
		for (Map.Entry<String, AttributeValue> item : attributeList.entrySet()) {
			if (!itemString.equals(""))
				itemString += ", ";
			String attributeName = item.getKey();
			AttributeValue value = item.getValue();
			itemString += attributeName + "" + (value.getS() == null ? "" : "=\"" + value.getS() + "\"")
					+ (value.getN() == null ? "" : "=\"" + value.getN() + "\"")
					+ (value.getB() == null ? "" : "=\"" + value.getB() + "\"")
					+ (value.getSS() == null ? "" : "=\"" + value.getSS() + "\"")
					+ (value.getNS() == null ? "" : "=\"" + value.getNS() + "\"")
					+ (value.getBS() == null ? "" : "=\"" + value.getBS() + "\" \n");
		}
		logMessage(itemString);
	}

	public static void main(String[] args) {

		try {

			DynamoDBClient dbClient = new DynamoDBClient();

			System.out.println("HELLO  AWS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

			dbClient.describeTable();

			dbClient.listItems();

		} catch (Exception e) {
			e.printStackTrace();
		}

	}

}