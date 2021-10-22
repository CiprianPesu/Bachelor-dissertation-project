// Decompiled by Jad v1.5.8e. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.geocities.com/kpdus/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   RSSreader.java

package com.rss;

import java.io.*;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.json.*;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.phantomjs.PhantomJSDriver;
import org.openqa.selenium.remote.DesiredCapabilities;

// Referenced classes of package com.rss:
//            RSSreaderLogger

public class RSSreader
{

    public RSSreader(String rssURL, String key)
    {
        this.rssURL = rssURL;
        this.key = key;
        readBackup();
    }

    private void writeBackup(JSONArray toBackup)
    {
        File file = new File("backup.txt");
        try
        {
            FileWriter fr = new FileWriter(file, false);
            fr.write(toBackup.toString(4));
            fr.close();
        }
        catch(IOException e)
        {
            e.printStackTrace();
        }
    }

    private void readBackup()
    {
        File file = new File("backup.txt");
        byte data[] = new byte[(int)file.length()];
        try
        {
            if(file.exists())
            {
                FileInputStream fis = new FileInputStream(file);
                fis.read(data);
                fis.close();
                String str = new String(data, "UTF-8");
                OldNews = new JSONArray(str);
            }
        }
        catch(IOException e)
        {
            e.printStackTrace();
        }
    }

    private void sendToKafka(JSONArray news, String channel)
    {
        Properties prop = new Properties();
        prop.put("bootstrap.servers", "10.0.0.1:9092");
        prop.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        prop.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        KafkaProducer KP = new KafkaProducer(prop);
        for(int i = 0; i < news.length(); i++)
        {
            JSONObject item = news.getJSONObject(i);
            Boolean findOld = Boolean.valueOf(false);
            if(OldNews != null)
            {
                for(int j = 0; j < OldNews.length(); j++)
                {
                    JSONObject OldItem = OldNews.getJSONObject(j);
                    String oldTitle = OldItem.getString("title");
                    String newTitle = item.getString("title");
                    if(!oldTitle.equals(newTitle))
                        continue;
                    findOld = Boolean.valueOf(true);
                    break;
                }

            }
            if(!findOld.booleanValue())
            {
                JSONObject standard_news = new JSONObject();
                standard_news.put("source", channel);
                standard_news.put("link", item.getString("link"));
                standard_news.put("title", item.getString("title"));
                try
                {
                    standard_news.put("description", item.getString("description"));
                }
                catch(Exception e)
                {
                    standard_news.put("description", " ");
                }
                try
                {
                    standard_news.put("pubDate", item.getString("pubDate"));
                }
                catch(Exception e)
                {
                    standard_news.put("pubDate", " ");
                }
                SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd 'at' HH:mm:ss z");
                Date date = new Date(System.currentTimeMillis());
                RSSreaderLogger.logText((new StringBuilder(String.valueOf(formatter.format(date)))).append("  -->  ").append(item.getString("title")).toString());
                ProducerRecord prodRec = new ProducerRecord("rss_data", key, standard_news.toString(4));
                KP.send(prodRec);
            }
        }

        KP.close();
        OldNews = news;
        writeBackup(OldNews);
    }

    public void readRSS()
    {
        try
        {
            SimpleDateFormat formatter_2 = new SimpleDateFormat("yyyy-MM-dd 'at' HH:mm:ss z");
            Date date_2 = new Date(System.currentTimeMillis());
            RSSreaderLogger.logText((new StringBuilder("STARTING AT ")).append(formatter_2.format(date_2)).append("\n").toString());
            String xamlFile = null;
            URL oracle = new URL(rssURL);
            DesiredCapabilities caps = new DesiredCapabilities();
            caps.setJavascriptEnabled(true);
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
        catch(IOException ioexception) { }
    }

    String rssURL;
    String key;
    JSONArray OldNews;
}
