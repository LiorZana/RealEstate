import { MapProps, MapRef, ViewState, ViewStateChangeEvent } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ComponentType, forwardRef, lazy, PropsWithChildren } from 'react';
import { Box, BoxProps } from '@mui/material';
import { MapboxEvent } from 'mapbox-gl';
import Loadable from '../Loadable';

const MapGl = Loadable(
  lazy<ComponentType<MapProps>>(() => import('./MapGl') as UTILS.DynamicImportPromiseType<MapProps>)
);

const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string;

export type MapState = {
  longitude: number;
  latitude: number;
  zoom: number;
};

export interface MapGLProps {
  viewState: ViewState;
  onChange(state: ViewState): void;
  onChangeStart?(state: ViewState): void;
  onChangeEnd?(state: ViewState): void;
  onLoad?(event: MapboxEvent): void;
  style?: MapProps['style'];
  width?: number | string;
  height?: number | string;
  rootProps?: PropsWithChildren<BoxProps>;
  reuseMaps?: boolean;
  trackResize?: boolean;
}

const getChangeHandler = (callback?: (state: ViewState) => void) => {
  return function HandleChange(e: ViewStateChangeEvent) {
    if (e.originalEvent?.cancelable) {
      e.originalEvent.preventDefault();
    }
    if (callback) {
      callback(e.viewState);
    }
  };
};

const MapGL = forwardRef<MapRef, PropsWithChildren<MapGLProps>>(
  (
    {
      viewState,
      onChange,
      onChangeStart,
      onChangeEnd,
      onLoad,
      rootProps = { children: null },
      style = {},
      width = style.width || '100%',
      height = style.height || 800,
      reuseMaps = true,
      trackResize = true,
      children
    },
    ref
  ) => {
    const { children: rootChildren, ...rootRest } = rootProps;
    const handleChange = getChangeHandler(onChange);
    const handleChangeStart = getChangeHandler(onChangeStart);
    const handleChangeEnd = getChangeHandler(onChangeEnd);
    return (
      <Box {...rootRest}>
        <MapGl
          ref={ref}
          onLoad={onLoad}
          reuseMaps={reuseMaps}
          trackResize={trackResize}
          mapboxAccessToken={accessToken}
          latitude={+viewState.latitude}
          longitude={+viewState.longitude}
          zoom={+viewState.zoom}
          onDrag={handleChange}
          onZoom={handleChange}
          onDragStart={handleChangeStart}
          onZoomStart={handleChangeStart}
          onDragEnd={handleChangeEnd}
          onZoomEnd={handleChangeEnd}
          style={{ width, height, ...style }}
          mapStyle='mapbox://styles/mapbox/streets-v9'
        >
          {children}
        </MapGl>
        {rootChildren}
      </Box>
    );
  }
);
export default MapGL;
