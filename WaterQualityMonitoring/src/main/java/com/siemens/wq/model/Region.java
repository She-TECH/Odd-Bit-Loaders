/*
 * Copyright (c) Siemens AG 2019 ALL RIGHTS RESERVED.
 *
 * R8  
 * 
 */

package com.siemens.wq.model;

import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "region")
public class Region
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    
  //  @Column(name = "region_id", unique = true, nullable = false)
    private int region_id;
    
    @Column(name = "region_name")
    private String region_name;
    
    public int getRegionID()
    {
        return region_id;
    }
    
    public void setRegionID(int regionID)
    {
        this.region_id = regionID;
    }
    
    public String getRegionName()
    {
        return region_name;
    }
    
    public void setRegionName(String regionName)
    {
        this.region_name = regionName;
    }
    
    
    /*public Region(@JsonProperty("regionID") int regionID,
    		@JsonProperty("regionName") String regionName) {
    	this.region_id = regionID;
    	this.region_name = regionName;

    }*/

	public Region() {
		
	}
    
    
}

/*
 * Copyright (c) Siemens AG 2019 ALL RIGHTS RESERVED
 * R8
 */
