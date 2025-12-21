import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={25} height={25} viewBox="0 0 16 16" {...props}>
      <Path
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={0.2}
        fillRule="evenodd"
        d="M8.36 1.37l6.36 5.8-.71.71L13 6.964v6.526l-.5.5h-3l-.5-.5v-3.5H7v3.5l-.5.5h-3l-.5-.5V6.972L2 7.88l-.71-.71 6.35-5.8zM4 6.063v6.927h2v-3.5l.5-.5h3l.5.5v3.5h2V6.057L8 2.43z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgComponent;
