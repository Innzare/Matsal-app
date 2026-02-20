import { Text as RNText } from 'react-native';

export const Text = ({ style, className, ...props }: any) => {
  return <RNText className={`dark:text-dark-text ${className || ''}`} style={[style]} {...props} />;
};
