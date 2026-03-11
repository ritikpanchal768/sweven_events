package com.example.event_management_backend.db;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.sql.*;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class DbUtils {

    private final DataSource dataSource;

    public DbUtils(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    private static final ObjectMapper mapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    // ============================================================
    // GET SINGLE OBJECT
    // ============================================================

    public <T> T returnedAsObject(
            String query,
            Class<T> clazz,
            Object... parameters) throws Exception {

        Connection con = DataSourceUtils.getConnection(dataSource);

        try (PreparedStatement ps = con.prepareStatement(query)) {

            setParameters(ps, parameters);

            ResultSet rs = ps.executeQuery();

            if (!rs.next()) return null;

            T instance = clazz.getDeclaredConstructor().newInstance();

            mapResultSetToObject(rs, instance);

            return instance;

        } catch (Exception e) {

            throw new Exception("DB ERROR (returnedAsObject): " + e.getMessage(), e);

        } finally {

            DataSourceUtils.releaseConnection(con, dataSource);
        }
    }

    // ============================================================
    // GET LIST
    // ============================================================

    public <T> List<T> returnedAsList(
            String query,
            Class<T> clazz,
            Object... parameters) throws Exception {

        Connection con = DataSourceUtils.getConnection(dataSource);

        try (PreparedStatement ps = con.prepareStatement(query)) {

            setParameters(ps, parameters);

            ResultSet rs = ps.executeQuery();

            List<T> result = new ArrayList<>();

            while (rs.next()) {

                T instance = clazz.getDeclaredConstructor().newInstance();

                mapResultSetToObject(rs, instance);

                result.add(instance);
            }

            return result;

        } catch (Exception e) {

            throw new Exception("DB ERROR (returnedAsList): " + e.getMessage(), e);

        } finally {

            DataSourceUtils.releaseConnection(con, dataSource);
        }
    }

    // ============================================================
    // SAVE OBJECT (REFLECTION INSERT)
    // ============================================================

    public <T> void saveObject(T object, String tableName) throws Exception {

        Map<String, Object> fieldMap = extractNonNullFields(object);

        if (fieldMap.isEmpty()) {
            throw new RuntimeException("No fields to insert!");
        }

        String columns = String.join(",", fieldMap.keySet());

        String placeholders = fieldMap.keySet()
                .stream()
                .map(k -> "?")
                .collect(Collectors.joining(","));

        String sql = "INSERT INTO " + tableName +
                " (" + columns + ") VALUES (" + placeholders + ")";

        Connection con = DataSourceUtils.getConnection(dataSource);

        try (PreparedStatement stmt = con.prepareStatement(sql)) {

            setStatementValues(stmt, fieldMap.values(), con);

            stmt.executeUpdate();

        } catch (SQLException e) {

            throw new SQLException("DB ERROR (saveObject): " + e.getMessage(), e);

        } finally {

            DataSourceUtils.releaseConnection(con, dataSource);
        }
    }

    // ============================================================
    // SAVE LIST (BATCH INSERT)
    // ============================================================

    public <T> void saveList(List<T> objects, String tableName) throws Exception {

        if (objects == null || objects.isEmpty()) {
            return;
        }

        Connection con = DataSourceUtils.getConnection(dataSource);

        try {

            con.setAutoCommit(false);

            // Use first object to determine columns
            Map<String, Object> firstFieldMap = extractNonNullFields(objects.get(0));

            if (firstFieldMap.isEmpty()) {
                throw new RuntimeException("No fields to insert!");
            }

            String columns = String.join(",", firstFieldMap.keySet());

            String placeholders = firstFieldMap.keySet()
                    .stream()
                    .map(k -> "?")
                    .collect(Collectors.joining(","));

            String sql = "INSERT INTO " + tableName +
                    " (" + columns + ") VALUES (" + placeholders + ")";

            try (PreparedStatement stmt = con.prepareStatement(sql)) {

                for (T object : objects) {

                    Map<String, Object> fieldMap = extractNonNullFields(object);

                    setStatementValues(stmt, fieldMap.values(), con);

                    stmt.addBatch();
                }

                stmt.executeBatch();
            }

            con.commit();

        } catch (Exception e) {

            con.rollback();

            throw new Exception("DB ERROR (saveList): " + e.getMessage(), e);

        } finally {

            con.setAutoCommit(true);

            DataSourceUtils.releaseConnection(con, dataSource);
        }
    }


    // ============================================================
    // UPDATE OBJECT
    // ============================================================

    public <T> void updateObject(
            T object,
            String tableName,
            UUID id) throws Exception {

        Map<String, Object> fieldMap = extractNonNullFields(object);

        if (fieldMap.isEmpty()) {
            throw new RuntimeException("No fields to update!");
        }

        String setClause = fieldMap.keySet()
                .stream()
                .map(f -> f + " = ?")
                .collect(Collectors.joining(","));

        String sql = "UPDATE " + tableName +
                " SET " + setClause +
                " WHERE id = ?";

        Connection con = DataSourceUtils.getConnection(dataSource);

        try (PreparedStatement stmt = con.prepareStatement(sql)) {

            setStatementValues(stmt, fieldMap.values(), con);

            stmt.setObject(fieldMap.size() + 1, id);

            stmt.executeUpdate();

        } catch (SQLException e) {

            throw new SQLException("DB ERROR (updateObject): " + e.getMessage(), e);

        } finally {

            DataSourceUtils.releaseConnection(con, dataSource);
        }
    }

    public void batchUpdate(String sql, List<Object[]> paramsList) throws Exception {

        Connection con = DataSourceUtils.getConnection(dataSource);

        try (PreparedStatement ps = con.prepareStatement(sql)) {

            for (Object[] params : paramsList) {
                setParameters(ps, params);
                ps.addBatch();
            }

            ps.executeBatch();

        } catch (SQLException e) {
            throw new Exception("DB ERROR (batchUpdate): " + e.getMessage(), e);
        } finally {
            DataSourceUtils.releaseConnection(con, dataSource);
        }
    }

    // ============================================================
    // INTERNAL HELPERS
    // ============================================================

    private Map<String, Object> extractNonNullFields(Object object)
            throws IllegalAccessException {

        Map<String, Object> fieldMap = new LinkedHashMap<>();

        Class<?> clazz = object.getClass();

        while (clazz != null) {

            for (Field field : clazz.getDeclaredFields()) {

                field.setAccessible(true);

                Object value = field.get(object);

                // 🔥 Skip null → allows DB defaults
                if (value != null) {
                    fieldMap.put(field.getName(), value);
                }
            }

            clazz = clazz.getSuperclass();
        }

        return fieldMap;
    }

    private void setParameters(
            PreparedStatement ps,
            Object... parameters) throws SQLException {

        if (parameters == null) return;

        for (int i = 0; i < parameters.length; i++) {

            ps.setObject(i + 1, parameters[i]);
        }
    }

    public void executeUpdate(String query, Object... parameters) throws Exception {

        Connection con = DataSourceUtils.getConnection(dataSource);

        try (PreparedStatement ps = con.prepareStatement(query)) {

            setParameters(ps, parameters);
            ps.executeUpdate();

        } catch (SQLException e) {

            throw new Exception("DB ERROR (executeUpdate): " + e.getMessage(), e);

        } finally {

            DataSourceUtils.releaseConnection(con, dataSource);
        }
    }

    private void setStatementValues(
            PreparedStatement stmt,
            Collection<Object> values,
            Connection con) throws Exception {

        int index = 1;

        for (Object value : values) {

            if (value instanceof Instant instant) {

                stmt.setTimestamp(index++, Timestamp.from(instant));

            } else if (value instanceof LocalDateTime ldt) {

                stmt.setTimestamp(index++, Timestamp.valueOf(ldt));

            } else if (value instanceof LocalDate ld) {

                stmt.setDate(index++, java.sql.Date.valueOf(ld));

            } else if (value instanceof List<?> list) {

                Array sqlArray =
                        con.createArrayOf("text", list.toArray());

                stmt.setArray(index++, sqlArray);

            } else if (value instanceof BigDecimal bd) {

                stmt.setBigDecimal(index++, bd);

            } else if (value instanceof Boolean bool) {

                stmt.setBoolean(index++, bool);

            } else if (value instanceof UUID uuid) {

                stmt.setObject(index++, uuid);

            } else {

                stmt.setObject(index++, value);
            }
        }
    }

    private void mapResultSetToObject(
            ResultSet rs,
            Object instance) throws Exception {

        Class<?> clazz = instance.getClass();

        while (clazz != null) {

            for (Field field : clazz.getDeclaredFields()) {

                field.setAccessible(true);

                Object dbValue;

                try {
                    dbValue = rs.getObject(field.getName());
                } catch (SQLException e) {
                    continue; // column missing
                }

                if (dbValue == null) continue;

                if (field.getType().equals(Instant.class)
                        && dbValue instanceof Timestamp ts) {

                    field.set(instance, ts.toInstant());
                    continue;
                }
                // LocalDateTime support
                if (field.getType().equals(LocalDateTime.class)
                        && dbValue instanceof Timestamp ts) {

                    field.set(instance, ts.toLocalDateTime());
                    continue;
                }

// LocalDate support
//                if (field.getType().equals(LocalDate.class)
//                        && dbValue instanceof Date date) {
//
//                    field.set(instance, date.toLocalDate());
//                    continue;
//                }

                if (dbValue instanceof Array arr
                        && field.getType().equals(List.class)) {

                    field.set(instance,
                            Arrays.asList((Object[]) arr.getArray()));
                    continue;
                }

                // JSON support
                if (dbValue instanceof String str
                        && !field.getType().equals(String.class)
                        && !field.getType().isPrimitive()) {

                    try {
                        Object obj =
                                mapper.readValue(str, field.getType());
                        field.set(instance, obj);
                        continue;
                    } catch (Exception ignored) {
                    }
                }

                field.set(instance, dbValue);
            }

            clazz = clazz.getSuperclass();
        }
    }
}
