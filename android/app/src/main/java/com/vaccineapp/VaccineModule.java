package com.vaccineapp;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

public class VaccineModule extends ReactContextBaseJavaModule {
    private OrcaManager manager = null;
    VaccineModule(ReactApplicationContext context) {
        super(context);
        try {
            manager = new OrcaManager(context);
        }
        catch (Exception ex){
            ex.printStackTrace();
        }
    }

    @NonNull
    @Override
    public String getName() {
        return "VaccineModule";
    }

    @ReactMethod
    public void hasVendorOptimization(Promise promise) {
        System.out.println("hasVendorOptimization called");
        WritableMap params = Arguments.createMap();
        params.putBoolean("status", manager.hasVendorOptimization());
        promise.resolve(params);
    }

    @ReactMethod
    public void startBatteryOptimizationScreens() {
        System.out.println("startBatteryOptimizationScreens called");
        manager.startIntents();
    }
}