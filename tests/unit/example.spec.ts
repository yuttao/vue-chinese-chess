import { shallowMount } from "@vue/test-utils";
import CharAdvisor from "@/components/CharAdvisor.vue";

describe("CharAdvisor.vue", () => {
  it("renders CharAdvisor", () => {
    const wrapper = shallowMount(CharAdvisor, {
      props: { },
    });
    expect(wrapper).toBeTruthy()
  });
});
