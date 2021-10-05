package com.rss;


public class App {

    String rssURL;
	public static void main(String[] args) {
		
        RSSreader BBCrss= new RSSreader("http://feeds.bbci.co.uk/news/rss.xml","BBC");
        RSSreader CNNrss= new RSSreader("http://rss.cnn.com/rss/edition.rss","CNN");
        RSSreader FOXrss= new RSSreader("http://feeds.foxnews.com/foxnews/latest","FOX");

        while(true)
        {
            BBCrss.readRSS();
            CNNrss.readRSS();
            FOXrss.readRSS();

            try {
                Thread.sleep(600000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

}
