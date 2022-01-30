import {
  Button,
  ContactProfile,
  Modal,
  RoundBottom,
} from '@dagdag/common/components';
import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import CallIcon from '@dagdag/common/assets/icons/call.svg';
import CloseIcon from '@dagdag/common/assets/icons/cross.svg';

import { RoundIconButton } from '@dagdag/common/components/RoundIconButton';
import { updateOrderStatus } from '@services/order';
import { OrderStatus } from '@dagdag/common/types';
import { useRecoilValue } from 'recoil';
import { currentOrderState } from '@stores/orders.atom';

import { callNumber } from '@dagdag/common/utils';
import { colors, font, layout } from '@dagdag/common/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import analytics from '@react-native-firebase/analytics';

const OnSpot: React.FC = () => {
  const insets = useSafeAreaInsets();
  const currentOrder = useRecoilValue(currentOrderState);
  const [isCancelModalOpened, setIsCancelModalOpened] = useState(false);

  return (
    <>
      <RoundBottom customStyle={{ bottom: insets.bottom }}>
        <View style={styles.top}>
          <ContactProfile
            firstName={currentOrder?.user.firstName!}
            image={currentOrder?.user.image}
            rating={currentOrder?.user.rating?.overall}
          />
          <Button
            icon={<CallIcon width={18} height={18} />}
            style={styles.call}
            text="Appeler"
            type="secondary"
            onPress={() => callNumber(currentOrder?.user.phoneNumber!)}
          />
        </View>

        <View style={styles.bottom}>
          <View style={styles.addressContainer}>
            <Text style={styles.pickup}>Point de rendez-vous: </Text>
            <Text style={styles.address}>
              {currentOrder?.departureAddress.formattedAddress}
            </Text>
          </View>
          <RoundIconButton onPress={() => setIsCancelModalOpened(true)}>
            <CloseIcon width={13} height={13} fill="red" stroke="red" />
          </RoundIconButton>
        </View>

        <Button
          text="Le passager est à bord"
          onPress={async () => {
            updateOrderStatus(OrderStatus.IN_PROGRESS, currentOrder!.uid);
            await analytics().logEvent('in_progress');
          }}
        />
      </RoundBottom>

      {isCancelModalOpened && (
        <Modal
          question="Êtes-vous sûr de vouloir annuler cette course ?"
          primaryText="Oui"
          secondaryText="Non"
          onPressPrimary={() =>
            updateOrderStatus(OrderStatus.CANCELED_BY_DRIVER, currentOrder!.uid)
          }
          onPressSecondary={() => setIsCancelModalOpened(false)}
          onPressOutside={() => setIsCancelModalOpened(false)}
        />
      )}
    </>
  );
};

export default OnSpot;

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  call: {
    flex: 1,
    marginLeft: layout.spacer6,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: layout.spacer5,
  },
  addressContainer: {},
  pickup: {
    color: colors.grey2,
    fontSize: font.fontSize2,
  },
  address: {
    color: colors.black,
    fontSize: font.fontSize3,
  },
});
