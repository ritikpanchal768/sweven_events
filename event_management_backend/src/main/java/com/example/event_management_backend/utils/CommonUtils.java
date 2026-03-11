package com.example.event_management_backend.utils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;

@Service
public class CommonUtils {
    private static Gson gson = new GsonBuilder()
            .setDateFormat("yyyy-MM-dd HH:mm:ss") // Specify the date format
            .create();

    /**
     * Copies all non-null fields from source object to target object.
     *
     * @param source The source object from which to copy fields.
     * @param target The target object to which fields are copied.
     * @throws IllegalArgumentException if source or target is null.
     * @throws IllegalAccessException   if fields are inaccessible.
     */
    public static void copyNonNullFields(Object source, Object target) throws IllegalAccessException {
        Field[] fields = source.getClass().getDeclaredFields();
        for (Field field : fields) {
            field.setAccessible(true);
            Object value = field.get(source);
            if (value != null) {
                Field targetField = null;
                try {
                    targetField = target.getClass().getDeclaredField(field.getName());
                    targetField.setAccessible(true);

                    // Check type compatibility before setting the value
                    if (targetField.getType().isAssignableFrom(field.getType())) {
                        targetField.set(target, value);
                    } else {
                        throw new IllegalArgumentException(
                                "Type mismatch: Cannot assign " + field.getType() + " to " + targetField.getType()
                        );
                    }
                } catch (NoSuchFieldException e) {
                    // Skip if the target does not have the field
                    continue;
                }
            }
        }
    }


    public static String toJSON(Object object){

        if (object == null){
            return null;
        }

        String objectJson = gson.toJson(object);
        return objectJson;
    }
}
