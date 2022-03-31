package com.rss;


public class App {

    String rssURL;
	public static void main(String[] args) {
		
        System.out.println(System.getenv("RSSLink"));
        System.out.println(System.getenv("RSSTag"));

        RSSreader RSS = new RSSreader(System.getenv("RSSLink"),System.getenv("RSSTag"));
        
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
