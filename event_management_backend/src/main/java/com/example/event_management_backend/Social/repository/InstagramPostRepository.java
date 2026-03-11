package com.example.event_management_backend.Social.repository;

import com.example.event_management_backend.Social.DTO.InstagramPost;
import com.example.event_management_backend.Social.Request.InstagramReorderRequest;
import com.example.event_management_backend.db.DbUtils;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public class InstagramPostRepository {
    private final DbUtils dbUtils;

    public InstagramPostRepository(DbUtils dbUtils) {
        this.dbUtils = dbUtils;
    }

    private static final String TABLE_NAME = "instagramposts";

    // ===============================
    // GET ALL POSTS
    // ===============================

    public List<InstagramPost> getAll() throws Exception {

        String query = """
                SELECT *
                FROM instagramposts
                ORDER BY displayorder ASC, createdat DESC
                """;

        return dbUtils.returnedAsList(query, InstagramPost.class);
    }

    // ===============================
    // GET By ID
    // ===============================

    public InstagramPost getById(UUID id) throws Exception {

        String query = """
                SELECT *
                FROM instagramposts
                where id =?
                """;

        return dbUtils.returnedAsObject(query, InstagramPost.class,id);
    }

    // ===============================
    // ADD POST
    // ===============================

    public void saveObject(InstagramPost post) throws Exception {

        dbUtils.saveObject(post, TABLE_NAME);
    }

    // ===============================
    // DELETE POST
    // ===============================
    public void delete(UUID id) throws Exception {

        String query = "DELETE FROM instagramposts WHERE id = ?";
        dbUtils.executeUpdate(query, id);
    }

    // ===============================
    // update POST
    // ===============================

    @Transactional
    public void reorderPosts(List<InstagramReorderRequest> reorderList) throws Exception {

        String sql = "UPDATE instagramposts SET displayOrder = ? WHERE id = ?";

        List<Object[]> params = reorderList.stream()
                .map(r -> new Object[]{ r.getDisplayOrder(), r.getId() })
                .toList();

        dbUtils.batchUpdate(sql, params);
    }

}
