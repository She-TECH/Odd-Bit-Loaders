import java.util.Iterator;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.ItemCollection;
import com.amazonaws.services.dynamodbv2.document.QueryOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;

public class dynamo {

	public static void main(String [] args)
	{
		AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard()
				.withRegion(Regions.AP_SOUTH_1).build();
				DynamoDB dynamoDB = new DynamoDB(client);

				Table table = dynamoDB.getTable("QualityParameters");

				QuerySpec spec = new QuerySpec()
				    .withKeyConditionExpression("Id = :v_id")
				    .withValueMap(new ValueMap()
				        .withString(":v_id", "Amazon DynamoDB#DynamoDB Thread 1"));

				ItemCollection<QueryOutcome> items = table.query(spec);

				Iterator<Item> iterator = items.iterator();
				Item item = null;
				while (iterator.hasNext()) {
				    item = iterator.next();
				    System.out.println(item.toJSONPretty());
				}
	}
}
