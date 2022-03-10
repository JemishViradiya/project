# SaveFilePicker Flow

Supports all chromium browsers

```mermaid
sequenceDiagram
	autonumber
	participant Tab as Browser Tab
	participant Api as Backend API
  Note over Tab: window.showSaveFilePicker -> WritableStream
  activate Tab
loop Paginated API Results
  Tab->>Api: Request
  activate Api
  Api->>Tab: Response
  deactivate Api
  Note over Tab: Transform Response
  Note over Tab: WritableStream.write([chunk])

alt Backpressure
  Note over Tab: Downlaod Buffer Full
  Note over Tab: stream:pause
  Note over Tab: <<-- Download Buffer Drain <<--
  Note over Tab: stream:resume
  Note over Tab: WritableStream.write([chunk])
else
  Note over Tab: WritableStream.write([chunk])
end

end

  Note over Tab: end of download
  deactivate Tab
```
