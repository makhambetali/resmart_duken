import React, { ReactNode } from 'react';
export interface VideoStreamProps {
    videoConstraints: MediaTrackConstraints;
    preferredCamera?: string;
    onReady: () => void;
    onStreamChanged: (stream: MediaStream) => void;
    onError: (err: Error) => void;
    children: ReactNode;
}
export interface VideoStreamState {
    orientation: string | number;
    stream?: MediaStream;
}
export default class VideoStream extends React.Component<VideoStreamProps, VideoStreamState> {
    constructor(props: VideoStreamProps);
    orientationChanged(e: Event): void;
    setDeviceIdInConstraints(constraints: MediaTrackConstraints): Promise<MediaTrackConstraints>;
    private readonly orientationchangeCallback;
    componentDidMount(): Promise<void>;
    refreshStream(): Promise<void>;
    stopCurrentStreams(): void;
    componentWillUnmount(): void;
    /**
     * Base class that does not specifically require a render function.
     * But needs to be implemented to satisfy later versions of React.Component interface.
     * Ideally would refactor this into ScanbotCameraView,
     * but it still effectively separates base video player functionality from the UI.
     */
    render(): React.ReactNode;
    updateTorch(enabled: boolean): Promise<void>;
    getCapabilities(): MediaTrackCapabilities | undefined;
    static getMediaTrackCapabilities(track: MediaStreamTrack): MediaTrackCapabilities | undefined;
    getVideoTrack(): MediaStreamTrack | undefined;
}
