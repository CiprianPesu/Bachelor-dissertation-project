package com.rss;


public class App {

    String rssURL;
	public static void main(String[] args) {
		
        System.out.println(System.getenv("RSSLink"));
        System.out.println(System.getenv("RSSTag"));


        RSSreader RSS = new RSSreader(System.getenv("RSSLink"),System.getenv("RSSTag"));
        //RSSreader BBCrss= new RSSreader("http://feeds.bbci.co.uk/news/rss.xml","BBC");
        //RSSreader CNNrss= new RSSreader("http://rss.cnn.com/rss/edition.rss","CNN");
        //RSSreader FOXrss= new RSSreader("http://feeds.foxnews.com/foxnews/latest","FOX");

        while(true)
        {
            RSS.readRSS();

            try {
                Thread.sleep(600000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

}
