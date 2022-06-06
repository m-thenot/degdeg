import React from 'react';
import { border, colors, layout } from '@dagdag/common/theme';
import { Text, View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Svg, { Circle, Line, Polygon } from 'react-native-svg';
import { getFormattedTime } from '../utils';

interface IRouteSummary {
  departureAddress: string;
  arrivalAddress: string;
  departureAt: number;
  style?: StyleProp<ViewStyle>;
}

export const RouteSummary: React.FC<IRouteSummary> = ({
  departureAddress,
  arrivalAddress,
  departureAt,
  style,
}) => {
  const styles = createStyles();
  return (
    <View style={[styles.summary, style]}>
      <View>
        <Text style={styles.time}>{getFormattedTime(departureAt)}</Text>
      </View>
      <View style={styles.elements}>
        <Svg height="10" width="10">
          <Circle cx="4" cy="4" r="4" fill={colors.primary} />
        </Svg>
        <Svg style={styles.line} height="49" width="3">
          <Line
            x1="0"
            y1="0"
            x2="0"
            y2="49"
            stroke={colors.grey3}
            strokeWidth="3"
          />
        </Svg>
        <Svg height="8" width="10">
          <Polygon points="0,0 10,0 4,8" fill={colors.grey3} />
        </Svg>
      </View>
      <View style={styles.addresses}>
        <Text style={styles.departureAddress}>{departureAddress}</Text>
        <Text> {arrivalAddress}</Text>
      </View>
    </View>
  );
};

const createStyles = () => {
  return StyleSheet.create({
    summary: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderRadius: border.radius3,
      borderColor: 'rgba(151, 173, 182, 0.2)',
      padding: layout.spacer3,
      marginTop: layout.spacer5,
      backgroundColor: colors.white,
    },
    elements: {
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: layout.spacer3,
    },
    line: {
      marginVertical: layout.spacer2,
    },

    addresses: {
      justifyContent: 'space-between',
      flexShrink: 1,
      width: '100%',
    },
    departureAddress: {
      marginBottom: 45,
    },
    time: {
      color: colors.grey3,
      paddingTop: 1,
    },
  });
};
