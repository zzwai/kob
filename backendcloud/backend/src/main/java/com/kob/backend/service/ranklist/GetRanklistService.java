package com.kob.backend.service.ranklist;

import com.alibaba.fastjson2.JSONObject;

import java.util.List;

public interface GetRanklistService {
    JSONObject getRanklist(Integer page);
}
