package com.siemens.wq.repo;

import java.util.ArrayList;
import java.util.UUID;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import org.springframework.stereotype.Repository;

import com.siemens.wq.model.Region;

/*@Repository("ishu")
public class RegionAccessService  implements RegionRepo{

	private static ArrayList <Region> al =new ArrayList<Region>();
	
	
	 @PersistenceContext
	    private EntityManager entityManager;
	@Override @Transactional
	public int insertRegion(UUID uuid, Region region) {
	
		insert into
		al.add(new Region(uuid,region.getRegionName()));
		
		System.out.println("al size"+al.get(0).getRegionName());
		return 1;
		
		 entityManager.createNativeQuery("INSERT INTO region (region_id, region_name) VALUES (?,?)")
	      .setParameter(1, region.getRegionID())
	      .setParameter(2, region.getRegionName())
	      .e;
		return 1;
		
	}
	
	*/
	

//}
