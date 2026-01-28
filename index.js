const magic = "7e8bb5a89f2842ac4af01b3b7e228592";

function decode(encoded_str) {
  const sliced = encoded_str.slice(magic.length);
  const compressed = Uint8Array.from(atob(sliced), (c) => c.charCodeAt(0));
  const jsonBytes = pako.inflateRaw(compressed);
  const jsonStr = new TextDecoder().decode(jsonBytes);

  return JSON.parse(jsonStr);
}

function encode(obj) {
  const jsonStr = JSON.stringify(obj);
  const jsonBytes = new TextEncoder().encode(jsonStr);
  const compressed = pako.deflateRaw(jsonBytes);

  let binary = "";
  for (let i = 0; i < compressed.length; i++) {
    binary += String.fromCharCode(compressed[i]);
  }

  const base64 = btoa(binary);

  return magic + base64;
}

function render_in_textarea(textarea_element, value) {
  textarea_element.value = value;
}

window.addEventListener("load", () => {
  const encoded_textarea = document.getElementById("encoded");
  const decoded_textarea = document.getElementById("decoded");

  const decode_button = document.getElementById("decode-button");
  const encode_button = document.getElementById("encode-button");

  decode_button.addEventListener("click", () => {
    const encoded_value = encoded_textarea.value;
    const decoded_value = decode(encoded_value);
    decoded_textarea.value = JSON.stringify(decoded_value, null, 2);
  });

  encode_button.addEventListener("click", () => {
    const decoded_object = JSON.parse(decoded_textarea.value);
    const encoded_value = encode(decoded_object);
    encoded_textarea.value = encoded_value;
  });
});
