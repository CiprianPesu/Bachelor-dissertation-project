package com.rss;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;


public class RSSreaderLogger {
    static String logFile="./Logs/log.txt";
    static File file = new File(logFile);
    

    public RSSreaderLogger(){}

    static void logText(String text){
        
        System.out.println(text);
        try {
            FileWriter fr = new FileWriter(file, true);
            fr.write(text+"\n");
            fr.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
