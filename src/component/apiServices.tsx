import axios from "axios";
export const postApiBeforeLogin = async (
  url: any,
  data: any,
  setLoding: any
) => {
  axios({
    data: data,
    url: url,
    method: "post",
  })
    .then((res) => {
      console.log("====================================");
      console.log(res?.data);
      console.log("====================================");
      if (res?.data?.responseCode == 200) {
        return res?.data;
      } else {
        return null;
      }
    })
    .catch((err) => {
      return null;
    });
};
