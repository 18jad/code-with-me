import styled from "styled-components/macro";

export const StyledFile = styled.div`
  flex-wrap: nowrap;
  display: flex;
  align-items: center;
  font-weight: 300;
  text-shadow: 0 0 1px #fff, 0 0 1px #fff;
  font-size: 15px;
  padding-left: ${(p) => p.theme.indent}px;
`;
