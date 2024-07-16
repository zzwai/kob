package com.kob.backend.controller.pk;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/pk/")
public class BotInfoController {

    @RequestMapping("getbotinfo/")
    public List<Map<String, String>> getBotInfo() {
        List<Map<String, String>> list = new LinkedList<>();
        Map<String, String> bot1 = new HashMap<>();
        bot1.put("name", "tiger");
        bot1.put("rank", "1200");
        Map<String, String> bot2 = new HashMap<>();
        bot2.put("name", "rabbit");
        bot2.put("rank", "1500");
        list.add(bot1);
        list.add(bot2);
        return list;
    }
}
