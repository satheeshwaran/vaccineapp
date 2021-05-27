package com.vaccineapp;

import android.app.Notification;
import android.app.PendingIntent;
import android.content.Context;
import android.content.res.Resources;
import android.os.Bundle;

import com.wix.reactnativenotifications.core.AppLaunchHelper;
import com.wix.reactnativenotifications.core.AppLifecycleFacade;
import com.wix.reactnativenotifications.core.JsIOHelper;
import com.wix.reactnativenotifications.core.notification.PushNotification;

/**
 * Overrides the default PushNotification implementation to create a
 * notification with a layout similar to the 'The Big Meeting' notification,
 * showing in the screenshot above
 */
public class VaccinePushNotification extends PushNotification {

    private Context mContext;

    public VaccinePushNotification(Context context, Bundle bundle, AppLifecycleFacade appLifecycleFacade, AppLaunchHelper appLaunchHelper, JsIOHelper jsIoHelper) {
        super(context, bundle, appLifecycleFacade, appLaunchHelper, jsIoHelper);
        mContext = context;
    }

    @Override
    protected Notification.Builder getNotificationBuilder(PendingIntent intent) {
        final Resources resources = mContext.getResources();

        // First, get a builder initialized with defaults from the core class.
        final Notification.Builder builder = super.getNotificationBuilder(intent);

        // Set our custom overrides --

        // Enable 'extended' layout (extends on down-stroke gesture):
        final Notification.BigTextStyle extendedNotificationStyle =
                new Notification.BigTextStyle()
                        .bigText(mNotificationProps.getBody());
        builder.setStyle(extendedNotificationStyle).setPriority(Notification.PRIORITY_HIGH);
        return builder;
    }
}