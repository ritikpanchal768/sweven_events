package com.example.event_management_backend.event.repository;

import com.example.event_management_backend.db.DbUtils;
import com.example.event_management_backend.event.dtos.Event;
import com.example.event_management_backend.event.dtos.TicketTier;
import com.example.event_management_backend.event.dtos.TicketTierFeature;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class TicketTierRepository {
    private final DbUtils dbUtils;

    public TicketTierRepository(DbUtils dbUtils) {
        this.dbUtils = dbUtils;
    }

    public void save(TicketTier tier) throws Exception {
        dbUtils.saveObject(tier, "ticketTier");
    }

    public void saveFeature(TicketTierFeature feature) throws Exception {
        dbUtils.saveObject(feature, "ticketTierFeature");
    }

    public List<TicketTier> findByEventId(UUID eventId) throws Exception {

        String sql = """
            SELECT * FROM tickettier
            WHERE eventid = ?
        """;

        return dbUtils.returnedAsList(sql, TicketTier.class, eventId);
    }
    public List<TicketTierFeature> getFeatureByTierId(UUID id) throws Exception {
        String query = "Select * from ticketTierFeature where tierid = ?";
        return dbUtils.returnedAsList(query, TicketTierFeature.class,id);
    }
    public TicketTier getTierByTierId(UUID id) throws Exception {
        String query = "Select * from ticketTier where id = ?";
        return dbUtils.returnedAsObject(query, TicketTier.class,id);
    }





}
