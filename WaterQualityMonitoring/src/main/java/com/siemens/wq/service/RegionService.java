/*
 * Copyright (c) Siemens AG 2019 ALL RIGHTS RESERVED.
 *
 * R8  
 * 
 */

package com.siemens.wq.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseBody;

import com.siemens.wq.model.Region;
import com.siemens.wq.repo.RegionRepo;
@Service
public class RegionService 
{
    @Autowired
    private RegionRepo regionRepo;

  
    
   
	
	public @ResponseBody void addRegion(Region region)
	{
		
		System.out.println("save function");
		regionRepo.save(region);
	//	return regionRepo.addRegion(region);
	}
    
}


/*
 * Copyright (c) Siemens AG 2019 ALL RIGHTS RESERVED
 *
 * R8
 */
