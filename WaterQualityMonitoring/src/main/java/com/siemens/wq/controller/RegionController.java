/*
 * Copyright (c) Siemens AG 2019 ALL RIGHTS RESERVED.
 *
 * R8  
 * 
 */

package com.siemens.wq.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.siemens.wq.model.Region;
import com.siemens.wq.service.RegionService;


@RestController
public class RegionController
{
	

	@Autowired
    private RegionService regionService;
    
    @PostMapping("/addRegion")
    public @ResponseBody void addRegion(@RequestBody Region regionObj)
    {
    	System.out.println("in controoler");
        regionService.addRegion(regionObj);
    }
    
    
}

/*
 * Copyright (c) Siemens AG 2019 ALL RIGHTS RESERVED
 * R8
 */
