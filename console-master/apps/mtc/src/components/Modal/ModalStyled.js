/* eslint-disable */

import styled from 'styled-components'

export default styled.div`
  padding: 24px;
  width: auto;
  min-height: ${props => (props.minHeight ? `${props.minHeight}px` : 0)};
  min-width: ${props => (props.minWidth ? `${props.minWidth}px` : 0)};
  .modal-title {
    margin-top: 0;
  }
  .modal-actions {
    float: right;
    margin-top: 24px;
    .cancel-button {
      margin-right: 16px;
    }
  }
  .modal-close-button {
    position: absolute;
    top: 8px;
    right: 8px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    &:hover {
      transform: scale(1.1);
    }
  }
  .modal-warning {
    & > p {
      margin-top: 24px;
    }
    & > p,
    .modal-warning-info p {
      font-size: 14px;
      max-width: 600px;
    }
    .modal-warning-info {
      padding: 24px;
      background: #e0e0e0;
      svg {
        margin: 0 auto 24px auto;
        display: block;
        font-size: 36px;
      }
      p {
        text-align: center;
      }
    }
  }
  .modal-verify {
    margin-top: 12px;
    max-width: 600px;
    margin-left: 10px;
    &.modal-verify-checkbox {
      display: flex & > span {
        float: left;
        margin-top: 0;
        width: auto;
        height: auto;
        svg {
          fill: #03a5ef;
        }
      }
    }
  }
`
