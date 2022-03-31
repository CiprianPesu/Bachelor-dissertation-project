
package com.rss;
import java.util.Properties;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.json.*;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.phantomjs.PhantomJSDriver;
import org.openqa.selenium.remote.DesiredCapabilities;

public class RSSreader {

    public RSSreader(String rssURL, String key) {
        this.rssURL = rssURL;
        this.key = key;
    }

    private void sendToKafka(JSONArray news, String channel) {
        Properties prop = new Properties();
        prop.put("bootstrap.servers", "10.0.0.1:9092");
        prop.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        prop.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        KafkaProducer KP = new KafkaProducer(prop);
        for (int i = 0; i < news.length(); i++) {
            JSONObject item = news.getJSONObject(i);
            JSONObject standard_news = new JSONObject();
            standard_news.put("source", channel);
            standard_news.put("link", item.getString("link"));
            standard_news.put("title", item.getString("title"));
            standard_news.put("RSSTag", key);
            try {
                standard_news.put("description", item.getString("description"));
            } catch (Exception e) {
                standard_news.put("description", " ");
            }
            try {
                standard_news.put("pubDate", item.getString("pubDate"));
            } catch (Exception e) {
                standard_news.put("pubDate", " ");
            }
            ProducerRecord prodRec = new ProducerRecord("rss_data", key, standard_news.toString(4));
            KP.send(prodRec);
        }

        KP.close();
    }

    public void readRSS() {

        String xamlFile = null;
        DesiredCapabilities caps = new DesiredCapabilities();
        caps.setJavascriptEnabled(true);
        caps.setCapability("takesScreenshot", false);
        caps.setCapability("phantomjs.binary.path", "phantomjs");
        WebDriver driver = new PhantomJSDriver(caps);
        driver.get(rssURL);
        xamlFile = driver.getPageSource();
        System.out.println("----------xamlFile---------");
        System.out.println(xamlFile);
        System.out.println("----------xamlFile---------");
        JSONObject xmlJSONObj = XML.toJSONObject(xamlFile);
        String channel = xmlJSONObj.getJSONObject("rss").getJSONObject("channel").getString("title");
        JSONArray news = xmlJSONObj.getJSONObject("rss").getJSONObject("channel").getJSONArray("item");
        sendToKafka(news, channel);
    }

    String rssURL;
    String key;
}