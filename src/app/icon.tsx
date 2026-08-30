import { ImageResponse } from "next/og"

export const size = {
  width: 512,
  height: 512,
}

export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f472b6, #db2777)",
          borderRadius: "100px",
        }}
      >
        <div
          style={{
            width: "80%",
            height: "80%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "200px",
            fontWeight: "bold",
            color: "white",
            fontFamily: "Inter, sans-serif",
          }}
        >
          DLC
        </div>
      </div>
    ),
    size
  )
}